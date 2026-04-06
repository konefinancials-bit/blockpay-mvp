import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;

    // Verify IPN signature
    if (secret && signature) {
      const sorted = JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort());
      const expected = crypto.createHmac('sha512', secret).update(sorted).digest('hex');
      if (expected !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_id, payment_status, order_id, pay_amount, pay_currency, price_amount, actually_paid } = data;

    if (!payment_id || !order_id) return NextResponse.json({ ok: true });

    // Extract merchantId from orderId: "bp-{merchantId8chars}-{timestamp}"
    const parts = order_id.split('-');
    // Order ID format: bp-{uid8}-{ts} but uid might have dashes. Just search Firestore.
    // Use payment_id to find the doc
    try {
      const db = getAdminDb();
      // Query for the payment across all merchants (best effort)
      // In production: store merchantId in payment doc and query directly
      const updateData = {
        status: payment_status,
        payAmount: pay_amount,
        payCurrency: pay_currency,
        priceAmount: price_amount,
        actuallyPaid: actually_paid ?? 0,
        updatedAt: new Date().toISOString(),
      };

      // Try to find by iterating (for MVP — in prod, store merchantId in payment doc)
      console.log(`[webhook] Payment ${payment_id} status: ${payment_status}`);
    } catch (err) {
      console.error('[webhook] Firestore update failed:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[webhook] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
