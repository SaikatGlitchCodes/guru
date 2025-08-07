import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'STRIPE_KEY_REMOVED', {
  apiVersion: '2023-10-16',
})

export async function POST(request) {
  try {
    const { amount, coins, currency = 'usd', userEmail } = await request.json()

    if (!amount || !coins) {
      return NextResponse.json(
        { error: 'Amount and coins are required' },
        { status: 400 }
      )
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${coins} Coins`,
              description: `Purchase ${coins} coins for your wallet`,
              images: [], // You can add coin images here
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/profile?payment=success&coins=${coins}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/profile?payment=cancelled`,
      metadata: {
        coins: coins.toString(),
        userEmail: userEmail,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
