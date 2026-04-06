# BlockPay — Tap to Pay with Crypto

> NFC tap-to-pay crypto payment infrastructure. No app required for customers. Non-custodial. 50+ coins.

**Live site:** [blockpay.live](https://blockpay.live) · **Seed round:** $15M open · **Launch:** Q3 2026

---

## Monorepo Structure

```
blockpay/
  apps/
    web/      ← Next.js 14 — landing page, merchant dashboard, public payment pages
    mobile/   ← Expo React Native — iOS + Android merchant app
  packages/
    shared/   ← TypeScript types, utils, API client
```

## Quick Start

### Web App

```bash
cd apps/web
cp .env.local.example .env.local
# Fill in env vars
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Mobile App

```bash
cd apps/mobile
npm install
npx expo start
```

Scan QR with Expo Go app.

## Environment Variables (apps/web/.env.local)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin private key |
| `NOWPAYMENTS_API_KEY` | NOWPayments API key (get at nowpayments.io) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_STARTER_PRICE_ID` | Stripe price ID for Starter plan |
| `STRIPE_BUSINESS_PRICE_ID` | Stripe price ID for Business plan |
| `STRIPE_WHITELABEL_PRICE_ID` | Stripe price ID for White-label plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NOWPAYMENTS_IPN_SECRET` | NOWPayments IPN secret key |
| `NEXT_PUBLIC_APP_URL` | Public URL (https://blockpay.live in prod) |

## How Payments Work

1. **Merchant sets amount** in dashboard (e.g. $49.00)
2. **NFC device** is programmed with URL: `blockpay.live/pay/{merchantId}?amount=49`
3. **Customer taps** phone on NFC device → browser opens payment page
4. **Customer sees** live crypto rates for BTC, ETH, SOL, USDC, etc.
5. **Customer taps** "Pay with BTC" → NOWPayments creates on-chain payment address
6. **Customer sends** crypto from their wallet
7. **Webhook fires** → Firestore updated → payment page shows ✓ confirmed
8. **Merchant receives** crypto directly (non-custodial) or auto-settles to USDC

## Deployment

### Web (Vercel)
```bash
vercel --prod
```
Set env vars in Vercel dashboard.

### Mobile (EAS Build)
```bash
cd apps/mobile
npx eas build --platform all
```

## Pricing Plans

| Plan | Price | Devices | Fee |
|---|---|---|---|
| Starter | $29/mo | 1 | 0.8% |
| Business | $99/mo | 5 | 0.5% |
| White-label | $499/mo | Custom | 0.3% |

## Tech Stack

- **Web:** Next.js 14, TypeScript, Tailwind CSS, Firebase, NOWPayments, Stripe
- **Mobile:** Expo 51, React Native, Firebase, Expo Router
- **Payments:** NOWPayments API (non-custodial crypto routing)
- **FX Rates:** CoinGecko API (live, no key required)
- **Auth/DB:** Firebase Auth + Firestore
- **Subscriptions:** Stripe

## Contact

- Founder: Keilan Robinson — [keilan@blockpay.live](mailto:keilan@blockpay.live)
- Investor inquiries: [keilan@blockpay.live](mailto:keilan@blockpay.live?subject=BlockPay%20Investor%20Inquiry)
- Discord: Coming Q2 2026
