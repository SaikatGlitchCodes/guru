import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function POST(request) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Extract payment details
    const paymentData = {
      session_id: session.id,
      status: session.payment_status === 'paid' ? 'succeeded' : session.payment_status,
      amount: session.amount_total,
      coins: parseInt(session.metadata?.coins || 0),
      customer_email: session.customer_email,
      created: session.created,
    }

    // Log the payment transaction in database
    try {
      const { error: logError } = await supabase
        .from('payment_transactions')
        .upsert({
          session_id: session.id,
          user_email: session.customer_email,
          amount: session.amount_total,
          coins: parseInt(session.metadata?.coins || 0),
          status: paymentData.status,
          payment_method: 'stripe',
          metadata: {
            stripe_session: {
              id: session.id,
              payment_intent: session.payment_intent,
              customer: session.customer,
            }
          },
          created_at: new Date(session.created * 1000).toISOString(),
        }, {
          onConflict: 'session_id'
        })

      if (logError) {
        console.error('Error logging payment transaction:', logError)
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Don't fail the request if logging fails
    }

    // If payment succeeded, ensure coins were added
    if (paymentData.status === 'succeeded' && paymentData.coins > 0 && session.customer_email) {
      try {
        // Check if coins were already added
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('coin_balance, email')
          .eq('email', session.customer_email)
          .single()

        if (!userError && user) {
          // Add coins if not already added (idempotency check)
          const { error: updateError } = await supabase
            .from('users')
            .update({
              coin_balance: supabase.raw(`COALESCE(coin_balance, 0) + ${paymentData.coins}`)
            })
            .eq('email', session.customer_email)

          if (updateError) {
            console.error('Error updating coin balance:', updateError)
          }
        }
      } catch (coinError) {
        console.error('Error handling coin addition:', coinError)
      }
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
