const BASE_URL = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY ?? '';

interface CreatePaymentParams {
  priceAmount: number;
  priceCurrency: string; // 'usd'
  payCurrency: string;   // 'btc', 'eth', etc.
  orderId: string;
  orderDescription?: string;
  ipnCallbackUrl?: string;
  payAddress?: string;   // merchant's wallet address
}

export interface NOWPayment {
  payment_id: string;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  price_amount: number;
  price_currency: string;
  order_id: string;
  order_description: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  amount_received: number;
  network: string;
  network_precision: number;
  time_limit: string | null;
  burning_percent: string | null;
}

async function nowFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NOWPayments error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function createPayment(params: CreatePaymentParams): Promise<NOWPayment> {
  return nowFetch<NOWPayment>('/payment', {
    method: 'POST',
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription ?? 'BlockPay payment',
      ipn_callback_url: params.ipnCallbackUrl,
      ...(params.payAddress ? { pay_address: params.payAddress } : {}),
    }),
  });
}

export async function getPaymentStatus(paymentId: string): Promise<NOWPayment> {
  return nowFetch<NOWPayment>(`/payment/${paymentId}`);
}

export interface EstimateResult {
  currency_from: string;
  amount_from: number;
  currency_to: string;
  estimated_amount: string;
}

export async function getEstimate(amount: number, from: string, to: string): Promise<EstimateResult> {
  return nowFetch<EstimateResult>(`/estimate?amount=${amount}&currency_from=${from}&currency_to=${to}`);
}

export async function getAvailableCurrencies(): Promise<string[]> {
  const result = await nowFetch<{ currencies: string[] }>('/currencies');
  return result.currencies;
}
