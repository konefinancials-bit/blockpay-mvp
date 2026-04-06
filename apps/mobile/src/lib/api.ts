const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://blockpay.live';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  return res.json();
}

export const apiClient = {
  createPayment: (body: { merchantId: string; amount: number; currency: string; coin: string; walletAddress?: string }) =>
    apiFetch('/api/payments/create', { method: 'POST', body: JSON.stringify(body) }),
  getPaymentStatus: (paymentId: string) =>
    apiFetch(`/api/payments/status/${paymentId}`),
  getRates: () =>
    apiFetch<Record<string, number>>('/api/rates'),
};
