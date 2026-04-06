import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/nowpayments';

export async function GET(_req: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const status = await getPaymentStatus(params.paymentId);
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
