import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) throw new Error('Missing webhook signature or secret');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const db = getAdminDb();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.uid;
      if (uid) {
        const priceId = sub.items.data[0]?.price?.id;
        const plan = Object.entries({ starter: process.env.STRIPE_STARTER_PRICE_ID, business: process.env.STRIPE_BUSINESS_PRICE_ID, whitelabel: process.env.STRIPE_WHITELABEL_PRICE_ID })
          .find(([, id]) => id === priceId)?.[0] ?? 'starter';
        await db.collection('merchants').doc(uid).update({
          plan,
          stripeCustomerId: sub.customer as string,
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.uid;
      if (uid) {
        await db.collection('merchants').doc(uid).update({ plan: 'starter', subscriptionStatus: 'canceled' });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
