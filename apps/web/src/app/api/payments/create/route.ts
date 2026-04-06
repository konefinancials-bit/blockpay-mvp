import { NextRequest, NextResponse } from 'next/server';
import { createPayment } from '@/lib/nowpayments';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, amount, currency = 'usd', coin, walletAddress } = body;

    if (!merchantId || !amount || !coin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = `bp-${merchantId.slice(0, 8)}-${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live';

    const payment = await createPayment({
      priceAmount: parseFloat(amount),
      priceCurrency: currency,
      payCurrency: coin,
      orderId,
      orderDescription: `BlockPay payment for ${merchantId}`,
      ipnCallbackUrl: `${appUrl}/api/payments/webhook`,
      payAddress: walletAddress,
    });

    // Save to Firestore
    try {
      const db = getAdminDb();
      await db.collection('merchants').doc(merchantId).collection('payments').doc(payment.payment_id).set({
        orderId,
        nowpaymentsId: payment.payment_id,
        status: payment.payment_status,
        priceAmount: payment.price_amount,
        priceCurrency: payment.price_currency,
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
        payAddress: payment.pay_address,
        fxRate: payment.pay_amount > 0 ? payment.price_amount / payment.pay_amount : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error('[payments/create] Firestore write failed:', dbErr);
    }

    return NextResponse.json(payment);
  } catch (err: any) {
    console.error('[payments/create] error:', err);
    return NextResponse.json({ error: err.message ?? 'Payment creation failed' }, { status: 500 });
  }
}
