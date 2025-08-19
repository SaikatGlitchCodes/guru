import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  throw new Error('Razorpay key_id or key_secret is missing in environment variables');
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = (await request.json()) as {
      amount: string;
      currency: string;
    };

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'rcp1',
    };
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Order creation failed' }, { status: 500 });
  }
}