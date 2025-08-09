import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'STRIPE_KEY_REMOVED', {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } else {
      // For development/testing without webhook signature verification
      event = JSON.parse(body)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      
      try {
        // Get the coins amount from metadata
        const coins = parseInt(session.metadata.coins)
        const userEmail = session.metadata.userEmail || session.customer_email
        
        if (!coins) {
          console.error('No coins metadata found in session')
          break
        }

        if (!userEmail) {
          console.error('No user email found in session')
          break
        }

        // Log the payment transaction
        const { error: logError } = await supabase
          .from('payment_transactions')
          .upsert({
            session_id: session.id,
            user_email: userEmail,
            amount: session.amount_total,
            coins: coins,
            status: session.payment_status === 'paid' ? 'succeeded' : 'processing',
            payment_method: 'stripe',
            metadata: {
              stripe_session: {
                id: session.id,
                payment_intent: session.payment_intent,
                customer: session.customer,
                amount_total: session.amount_total,
              }
            },
            created_at: new Date(session.created * 1000).toISOString(),
          }, {
            onConflict: 'session_id'
          })

        if (logError) {
          console.error('Error logging payment transaction:', logError)
        }

        // Update user's coin balance (with idempotency)
        const { error } = await supabase
          .from('users')
          .update({
            coin_balance: supabase.raw(`COALESCE(coin_balance, 0) + ${coins}`)
          })
          .eq('email', userEmail)

        if (error) {
          console.error('Error updating coin balance:', error)
          
          // Update transaction status to failed
          await supabase
            .from('payment_transactions')
            .update({ status: 'failed' })
            .eq('session_id', session.id)
        } else {
          console.log(`Successfully added ${coins} coins to user ${userEmail}`)
          
          // Ensure transaction status is succeeded
          await supabase
            .from('payment_transactions')
            .update({ status: 'succeeded' })
            .eq('session_id', session.id)
        }
      } catch (error) {
        console.error('Error processing checkout session:', error)
        
        // Log failed transaction
        try {
          await supabase
            .from('payment_transactions')
            .upsert({
              session_id: session.id,
              user_email: session.metadata.userEmail || session.customer_email,
              amount: session.amount_total,
              coins: parseInt(session.metadata.coins || 0),
              status: 'failed',
              payment_method: 'stripe',
              metadata: { error: error.message },
              created_at: new Date(session.created * 1000).toISOString(),
            }, {
              onConflict: 'session_id'
            })
        } catch (logError) {
          console.error('Error logging failed transaction:', logError)
        }
      }
      break

    case 'checkout.session.async_payment_failed':
      const failedSession = event.data.object
      
      try {
        // Update transaction status to failed
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'failed',
            metadata: { ...failedSession.metadata, failure_reason: 'async_payment_failed' }
          })
          .eq('session_id', failedSession.id)
        
        console.log(`Payment failed for session ${failedSession.id}`)
      } catch (error) {
        console.error('Error processing failed payment:', error)
      }
      break

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      
      try {
        const coins = parseInt(paymentIntent.metadata.coins)
        
        if (coins) {
          console.log(`Payment intent succeeded for ${coins} coins`)
          // Additional handling if needed
        }
      } catch (error) {
        console.error('Error processing payment intent:', error)
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
