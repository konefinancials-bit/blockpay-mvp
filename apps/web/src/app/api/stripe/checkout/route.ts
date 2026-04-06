import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, PlanKey } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = (searchParams.get('plan') ?? 'starter') as PlanKey;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live';

  const planConfig = PLANS[plan];
  if (!planConfig || !planConfig.priceId) {
    return NextResponse.redirect(`${appUrl}/auth/signup?plan=${plan}&error=invalid_plan`);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?subscription=success&plan=${plan}`,
      cancel_url: `${appUrl}/auth/signup?plan=${plan}`,
      allow_promotion_codes: true,
      metadata: { plan },
    });

    return NextResponse.redirect(session.url!);
  } catch (err: any) {
    console.error('[stripe/checkout] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
