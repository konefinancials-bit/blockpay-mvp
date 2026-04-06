import { NextResponse } from 'next/server';
import { SUPPORTED_COINS } from '@/lib/coins';

const CACHE_TTL = 5000; // 5 seconds
let ratesCache: { data: Record<string, number>; ts: number } | null = null;

export async function GET() {
  try {
    const now = Date.now();
    if (ratesCache && now - ratesCache.ts < CACHE_TTL) {
      return NextResponse.json(ratesCache.data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const ids = [...new Set(SUPPORTED_COINS.map((c) => c.coingeckoId))].join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

    const raw: Record<string, { usd: number }> = await res.json();

    // Map coingeckoId → usd price
    const rates: Record<string, number> = {};
    for (const coin of SUPPORTED_COINS) {
      rates[coin.coingeckoId] = raw[coin.coingeckoId]?.usd ?? 0;
    }

    ratesCache = { data: rates, ts: now };
    return NextResponse.json(rates, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    // Return stale cache if available
    if (ratesCache) return NextResponse.json(ratesCache.data);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
