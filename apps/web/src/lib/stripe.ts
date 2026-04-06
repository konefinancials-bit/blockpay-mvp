import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

export const PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? '',
    name: 'Starter',
    price: 29,
    devices: 1,
    txLimit: 500,
    fee: 0.8,
  },
  business: {
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? '',
    name: 'Business',
    price: 99,
    devices: 5,
    txLimit: -1, // unlimited
    fee: 0.5,
  },
  whitelabel: {
    priceId: process.env.STRIPE_WHITELABEL_PRICE_ID ?? '',
    name: 'White-label',
    price: 499,
    devices: -1, // custom
    txLimit: -1,
    fee: 0.3,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
