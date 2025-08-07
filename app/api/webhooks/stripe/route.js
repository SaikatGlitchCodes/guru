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

        // Update user's coin balance
        const { error } = await supabase
          .from('users')
          .update({
            coin_balance: supabase.raw(`COALESCE(coin_balance, 0) + ${coins}`)
          })
          .eq('email', userEmail)

        if (error) {
          console.error('Error updating coin balance:', error)
        } else {
          console.log(`Successfully added ${coins} coins to user ${userEmail}`)
        }
      } catch (error) {
        console.error('Error processing checkout session:', error)
      }
      break

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      
      try {
        const coins = parseInt(paymentIntent.metadata.coins)
        
        if (coins) {
          console.log(`Payment succeeded for ${coins} coins`)
          // Handle direct payment intent success if needed
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
