'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { DollarSign, CreditCard, TrendingUp, Percent } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PaymentRow } from '@/components/dashboard/PaymentRow';
import { useMerchantStore } from '@/stores/merchant-store';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { payments, paymentsLoading } = useMerchantStore();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayPayments = payments.filter((p) => new Date(p.createdAt).toDateString() === today);
    const todayVolume = todayPayments.filter((p) => ['confirmed', 'finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
    const totalVolume = payments.filter((p) => ['confirmed', 'finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
    const winCount = payments.filter((p) => ['confirmed', 'finished'].includes(p.status)).length;
    const winRate = payments.length > 0 ? ((winCount / payments.length) * 100).toFixed(1) : '0';

    // Coin breakdown
    const coinMap: Record<string, number> = {};
    payments.forEach((p) => { coinMap[p.payCurrency] = (coinMap[p.payCurrency] ?? 0) + 1; });
    const topCoin = Object.entries(coinMap).sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() ?? '—';

    return { todayVolume, totalVolume, todayCount: todayPayments.length, winRate, topCoin };
  }, [payments]);

  const recent = payments.slice(0, 8);

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Today's Volume" value={`$${stats.todayVolume.toFixed(2)}`} icon={DollarSign} iconColor="text-bp-green" />
          <StatsCard label="Today's Payments" value={String(stats.todayCount)} icon={CreditCard} iconColor="text-bp-cyan" />
          <StatsCard label="All-time Volume" value={`$${stats.totalVolume.toFixed(2)}`} icon={TrendingUp} iconColor="text-bp-purple" />
          <StatsCard label="Conversion Rate" value={`${stats.winRate}%`} icon={Percent} iconColor="text-yellow-400" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent payments */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Recent Payments</h2>
              {paymentsLoading && <Spinner size={16} />}
            </div>
            {recent.length === 0 && !paymentsLoading ? (
              <div className="text-center py-10 text-bp-text-dim text-sm">
                No payments yet. Share your payment link or set up an NFC device.
              </div>
            ) : (
              <div className="divide-y divide-bp-border/0">
                {recent.map((p) => <PaymentRow key={p.id} payment={p} />)}
              </div>
            )}
          </Card>

          {/* Quick stats */}
          <Card>
            <h2 className="font-bold mb-4">Top Coins</h2>
            {payments.length === 0 ? (
              <p className="text-bp-text-dim text-sm">No data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(
                  payments.reduce<Record<string, { count: number; volume: number }>>((acc, p) => {
                    const key = p.payCurrency.toUpperCase();
                    if (!acc[key]) acc[key] = { count: 0, volume: 0 };
                    acc[key].count++;
                    acc[key].volume += p.priceAmount;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 5)
                  .map(([coin, data]) => (
                    <div key={coin} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{coin}</div>
                        <div className="text-xs text-bp-text-dim">{data.count} payments</div>
                      </div>
                      <div className="text-sm font-bold text-bp-green">${data.volume.toFixed(2)}</div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
