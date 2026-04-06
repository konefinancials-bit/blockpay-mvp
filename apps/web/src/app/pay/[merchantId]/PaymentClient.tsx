'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Clock, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { SUPPORTED_COINS, Coin } from '@/lib/coins';

interface Merchant {
  businessName: string;
  displayName: string;
  wallets: Record<string, string>;
  plan: string;
}

interface Props {
  merchant: Merchant;
  merchantId: string;
  defaultAmount?: number;
}

interface RateMap {
  [coingeckoId: string]: { usd: number };
}

interface ActivePayment {
  paymentId: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  priceAmount: number;
  status: string;
}

const STATUS_INFO: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  waiting: { icon: <Clock className="size-5" />, label: 'Waiting for payment...', color: 'text-yellow-400' },
  confirming: { icon: <RefreshCw className="size-5 animate-spin" />, label: 'Confirming on-chain...', color: 'text-blue-400' },
  confirmed: { icon: <Check className="size-5" />, label: 'Payment confirmed!', color: 'text-green-400' },
  finished: { icon: <Check className="size-5" />, label: 'Payment complete!', color: 'text-green-400' },
  failed: { icon: <AlertCircle className="size-5" />, label: 'Payment failed', color: 'text-red-400' },
  expired: { icon: <AlertCircle className="size-5" />, label: 'Payment expired', color: 'text-gray-400' },
};

export function PaymentClient({ merchant, merchantId, defaultAmount }: Props) {
  const [amount, setAmount] = useState(defaultAmount?.toString() ?? '');
  const [rates, setRates] = useState<RateMap>({});
  const [ratesUpdated, setRatesUpdated] = useState<Date | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [activePayment, setActivePayment] = useState<ActivePayment | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Available coins (merchant has wallet for, or USDC/USDT always)
  const availableCoins = SUPPORTED_COINS.filter((c) =>
    merchant.wallets[c.id] || c.id === 'usdc' || c.id === 'usdt'
  );

  // Fetch live FX rates
  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
        setRatesUpdated(new Date());
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Poll payment status
  useEffect(() => {
    if (!activePayment || ['confirmed', 'finished', 'failed', 'expired'].includes(activePayment.status)) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status/${activePayment.paymentId}`);
        if (res.ok) {
          const data = await res.json();
          setActivePayment((p) => p ? { ...p, status: data.payment_status } : null);
        }
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, [activePayment]);

  const cryptoAmount = (coin: Coin): string => {
    const rate = rates[coin.coingeckoId]?.usd;
    if (!rate || !amount) return '—';
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return '—';
    return (parsed / rate).toFixed(8).replace(/\.?0+$/, '');
  };

  const handlePay = async (coin: Coin) => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    setSelectedCoin(coin);
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          amount: parseFloat(amount),
          currency: 'usd',
          coin: coin.nowpaymentsCode,
          walletAddress: merchant.wallets[coin.id],
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setActivePayment({
        paymentId: data.payment_id,
        payAddress: data.pay_address,
        payAmount: data.pay_amount,
        payCurrency: data.pay_currency,
        priceAmount: data.price_amount,
        status: data.payment_status,
      });
    } catch (err: any) {
      setError(err.message ?? 'Payment creation failed');
      setSelectedCoin(null);
    } finally {
      setCreating(false);
    }
  };

  const copyAddress = async () => {
    if (activePayment?.payAddress) {
      await navigator.clipboard.writeText(activePayment.payAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusInfo = activePayment ? STATUS_INFO[activePayment.status] : null;
  const isDone = activePayment && ['confirmed', 'finished'].includes(activePayment.status);
  const isFailed = activePayment && ['failed', 'expired'].includes(activePayment.status);

  return (
    <div className="min-h-screen bg-bp-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="size-14 rounded-2xl bg-purple-gradient flex items-center justify-center text-2xl font-black text-white mx-auto mb-3">
            {merchant.businessName?.[0]?.toUpperCase() ?? 'B'}
          </div>
          <h1 className="font-bold text-lg">{merchant.businessName}</h1>
          <p className="text-xs text-bp-text-dim">Powered by BlockPay</p>
        </div>

        {/* Active payment view */}
        {activePayment && (
          <div className="card p-5 mb-4">
            {/* Status */}
            <div className={`flex items-center gap-2 mb-4 ${statusInfo?.color}`}>
              {statusInfo?.icon}
              <span className="font-semibold text-sm">{statusInfo?.label}</span>
            </div>

            {isDone ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <div className="text-xl font-black gradient-text">${activePayment.priceAmount.toFixed(2)}</div>
                <div className="text-sm text-bp-text-sec mt-1">Payment received in {activePayment.payCurrency.toUpperCase()}</div>
              </div>
            ) : isFailed ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">❌</div>
                <button onClick={() => { setActivePayment(null); setSelectedCoin(null); }}
                  className="btn-primary px-6 py-2 text-sm mt-2">Try again</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-black">{activePayment.payAmount}</div>
                  <div className="text-lg text-bp-text-sec">{activePayment.payCurrency.toUpperCase()}</div>
                  <div className="text-xs text-bp-text-dim mt-1">= ${activePayment.priceAmount.toFixed(2)} USD</div>
                </div>

                {/* Address */}
                <div className="bg-bp-bg rounded-xl p-3 mb-3">
                  <div className="text-xs text-bp-text-dim mb-1">Send to this address</div>
                  <div className="text-xs font-mono text-bp-cyan break-all">{activePayment.payAddress}</div>
                </div>

                <button onClick={copyAddress}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-bp-border hover:border-bp-purple/50 text-sm font-medium text-bp-text-sec hover:text-white transition-all">
                  {copied ? <Check className="size-4 text-bp-green" /> : <Copy className="size-4" />}
                  {copied ? 'Copied!' : 'Copy address'}
                </button>

                <p className="text-xs text-center text-bp-text-dim mt-3">
                  This page updates automatically. Do not close it until payment is confirmed.
                </p>
              </>
            )}
          </div>
        )}

        {/* Coin selector (shown when no active payment) */}
        {!activePayment && (
          <div className="card p-5">
            {/* Amount input */}
            <div className="mb-5">
              <div className="text-xs text-bp-text-dim mb-2">Amount due</div>
              {defaultAmount ? (
                <div className="text-4xl font-black text-center py-2">${defaultAmount.toFixed(2)}</div>
              ) : (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bp-text-sec font-bold">$</span>
                  <input
                    type="number" min="0.01" step="0.01"
                    placeholder="0.00"
                    value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-bp-bg border border-bp-border text-white text-xl font-bold focus:outline-none focus:border-bp-purple"
                  />
                </div>
              )}
              {ratesUpdated && (
                <div className="text-[10px] text-bp-text-dim text-right mt-1">
                  Live rates · updated {ratesUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>

            {error && <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

            {/* Coin list */}
            <div className="space-y-2">
              {availableCoins.map((coin) => {
                const amt = cryptoAmount(coin);
                return (
                  <button
                    key={coin.id}
                    onClick={() => handlePay(coin)}
                    disabled={creating || !amount || parseFloat(amount) <= 0}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-bp-bg border border-bp-border hover:border-bp-purple/50 disabled:opacity-40 transition-all group"
                  >
                    <div className="size-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                      style={{ background: coin.color + '22', border: `1px solid ${coin.color}44`, color: coin.color }}>
                      {coin.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">{coin.name}</div>
                      <div className="text-xs text-bp-text-dim">{coin.symbol} · {coin.network}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{amt}</div>
                      <div className="text-[10px] text-bp-text-dim">{coin.symbol}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-bp-text-dim">
              <span>🔒</span>
              <span>Non-custodial · No personal info required · Powered by BlockPay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
