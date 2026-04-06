export interface Merchant {
  uid: string;
  displayName: string;
  email: string;
  businessName: string;
  plan: 'starter' | 'business' | 'whitelabel';
  wallets: Record<string, string>;
  autoSettle: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  nowpaymentsId: string;
  status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
  priceAmount: number;
  priceCurrency: string;
  payAmount: number;
  payCurrency: string;
  payAddress: string;
  fxRate: number;
  actuallyPaid?: number;
  createdAt: string;
  updatedAt: string;
  customerNote?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'puck' | 'card' | 'sticker';
  paymentUrl: string;
  defaultAmount?: number;
  active: boolean;
  createdAt: string;
}

export interface CoinRate {
  coingeckoId: string;
  symbol: string;
  usd: number;
  updatedAt: number;
}

export interface SubscriptionPlan {
  key: 'starter' | 'business' | 'whitelabel';
  name: string;
  price: number;
  devices: number;
  txLimit: number;
  fee: number;
  coins: number;
  priceId: string;
}

export interface NOWPaymentsPayment {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  price_amount: number;
  price_currency: string;
  order_id: string;
  order_description: string;
  created_at: string;
  updated_at: string;
}
