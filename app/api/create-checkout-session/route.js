import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function POST(request) {
  console.log('Creating checkout session...')
  
  try {
    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable')
      return NextResponse.json(
        { error: 'Stripe configuration is missing' },
        { status: 500 }
      )
    }

    // Parse request body
    let requestBody
    try {
      requestBody = await request.json()
      console.log('Request body:', requestBody)
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { amount, coins, currency = 'inr', userEmail } = requestBody

    // Validate required fields
    if (!amount || !coins) {
      console.error('Missing amount or coins:', { amount, coins })
      return NextResponse.json(
        { error: 'Amount and coins are required' },
        { status: 400 }
      )
    }

    if (!userEmail) {
      console.error('Missing userEmail:', { userEmail })
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    console.log('Creating Stripe session with:', {
      amount,
      coins,
      currency,
      userEmail
    })

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Only card is universally supported
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'inr', // Use INR for Indian accounts
            product_data: {
              name: `${coins} Coins`,
              description: `Purchase ${coins} coins for your wallet`,
              images: [], // You can add coin images here
            },
            unit_amount: Math.round(amount), // Amount in paise (100 paise = 1 INR)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/status?session_id={CHECKOUT_SESSION_ID}&status=succeeded`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/status?status=cancelled&coins=${coins}`,
      metadata: {
        coins: coins.toString(),
        userEmail: userEmail,
      },
      // For Indian accounts, ensure domestic transactions
      billing_address_collection: 'required',
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
    })

    console.log('Stripe session created successfully:', session.id)
    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message,
        type: error.type || 'unknown_error'
      },
      { status: 500 }
    )
  }
}
