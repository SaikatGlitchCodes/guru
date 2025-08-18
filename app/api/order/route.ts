
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Razorpay configuration is missing' },
        { status: 500 }
      )
    }

    const { amount, coins, currency = 'INR', userEmail, description } = await request.json()

    if (!amount || !coins || !userEmail) {
      return NextResponse.json(
        { error: 'Amount, coins, and user email are required' },
        { status: 400 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: currency,
      receipt: `coin_checkout_${Date.now()}`,
      payment_capture: 1,
      notes: {
        coins: coins.toString(),
        userEmail: userEmail,
        description: description || `Purchase ${coins} coins`,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}
