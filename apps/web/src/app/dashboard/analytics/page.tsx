'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { useMerchantStore } from '@/stores/merchant-store';

const COLORS = ['#6c63ff', '#00e5ff', '#00e676', '#ffb300', '#ff5252', '#9945FF', '#F7931A'];

export default function AnalyticsPage() {
  const { payments } = useMerchantStore();

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => {
      if (!['confirmed', 'finished'].includes(p.status)) return;
      const day = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[day] = (map[day] ?? 0) + p.priceAmount;
    });
    return Object.entries(map).slice(-14).map(([day, volume]) => ({ day, volume: parseFloat(volume.toFixed(2)) }));
  }, [payments]);

  const coinData = useMemo(() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => {
      const key = p.payCurrency.toUpperCase();
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [payments]);

  const hourlyData = useMemo(() => {
    const map: Record<number, { count: number; volume: number }> = {};
    for (let h = 0; h < 24; h++) map[h] = { count: 0, volume: 0 };
    payments.forEach((p) => {
      const hour = new Date(p.createdAt).getHours();
      map[hour].count++;
      if (['confirmed', 'finished'].includes(p.status)) map[hour].volume += p.priceAmount;
    });
    return Object.entries(map).map(([h, d]) => ({ hour: `${h}:00`, ...d }));
  }, [payments]);

  const tooltipStyle = {
    backgroundColor: '#12121a', border: '1px solid #1e1e2e', borderRadius: '10px', color: '#fff', fontSize: 12,
  };

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {payments.length === 0 && (
          <Card className="text-center py-10">
            <p className="text-bp-text-dim text-sm">No payment data yet. Analytics will appear after your first payment.</p>
          </Card>
        )}

        {/* Daily volume */}
        <Card>
          <h2 className="font-bold mb-5">Daily Volume (USD)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData}>
              <XAxis dataKey="day" tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, 'Volume']} />
              <Bar dataKey="volume" fill="#6c63ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Coin breakdown */}
          <Card>
            <h2 className="font-bold mb-5">Payments by Coin</h2>
            {coinData.length === 0 ? (
              <div className="text-center py-8 text-bp-text-dim text-sm">No data yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={coinData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {coinData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {coinData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2 text-xs">
                      <div className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-bp-text-sec">{c.name}</span>
                      <span className="font-bold ml-auto">{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Hourly heatmap */}
          <Card>
            <h2 className="font-bold mb-5">Volume by Hour</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyData}>
                <XAxis dataKey="hour" tick={{ fill: '#606070', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, 'Volume']} />
                <Line type="monotone" dataKey="volume" stroke="#00e5ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
