'use client';
export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import Link from 'next/link';
import { useMerchantStore } from '@/stores/merchant-store';

export default function DashboardPage() {
  const { merchant, payments, paymentsLoading } = useMerchantStore();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayP = payments.filter((p) => new Date(p.createdAt).toDateString() === today);
    const todayVol = todayP.filter((p) => ['confirmed','finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
    const monthVol = payments.filter((p) => ['confirmed','finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
    const coinSet = new Set(payments.map((p) => p.payCurrency.toUpperCase()));
    return { todayVol, monthVol, todayCount: todayP.length, txTotal: payments.length, coins: coinSet.size };
  }, [payments]);

  const recent = payments.slice(0, 5);

  const STATUS_COLOR: Record<string, string> = {
    confirmed: '#1A6644', finished: '#1A6644', waiting: '#92400E', confirming: '#1E40AF', failed: '#991B1B', expired: 'var(--subtle)',
  };

  return (
    <div className="page-body" style={{ maxWidth: 900 }}>
      <div className="page-label">Merchant Dashboard</div>
      <h1 className="page-title">Welcome back{merchant?.displayName ? `, ${merchant.displayName.split(' ')[0]}` : ''}.</h1>
      <p className="page-sub">
        {payments.length === 0
          ? "Your BlockPay dashboard is ready. Set up your wallet addresses and program your first NFC device to start accepting crypto."
          : `You've processed ${payments.length} payment${payments.length !== 1 ? 's' : ''} through BlockPay.`}
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: "Today's Revenue", val: `$${stats.todayVol.toFixed(2)}`, sub: `${stats.todayCount} payment${stats.todayCount !== 1 ? 's' : ''}`, subColor: stats.todayVol > 0 ? 'var(--green)' : 'var(--muted)' },
          { label: "All-time Volume", val: `$${stats.monthVol.toFixed(2)}`, sub: 'Confirmed only', subColor: 'var(--muted)' },
          { label: "Transactions", val: String(stats.txTotal), sub: `${stats.todayCount} today`, subColor: 'var(--muted)' },
          { label: "Active Coins", val: String(stats.coins || '—'), sub: 'Accepted currencies', subColor: 'var(--muted)' },
        ].map((s) => (
          <div key={s.label} className="info-card">
            <div className="info-card-label">{s.label}</div>
            <div className="info-card-val">{s.val}</div>
            <div className="info-card-sub" style={{ color: s.subColor }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '40px 0' }} />

      {/* Recent payments */}
      {recent.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, fontWeight: 400, letterSpacing: -0.5, marginBottom: 20 }}>Recent payments</h2>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'white', marginBottom: 32 }}>
            {recent.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>{p.orderId}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>${p.priceAmount.toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>{p.payCurrency.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: STATUS_COLOR[p.status] ?? 'var(--subtle)', background: STATUS_COLOR[p.status] ? STATUS_COLOR[p.status] + '12' : 'transparent', padding: '3px 10px', borderRadius: 100, border: `1px solid ${STATUS_COLOR[p.status] ?? 'var(--border)'}22` }}>
                  {p.status}
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/payments" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, textDecoration: 'none' }}>
            View all payments →
          </Link>
        </>
      )}

      {payments.length === 0 && (
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          This is your merchant dashboard.{' '}
          <Link href="/dashboard/settings" style={{ color: 'var(--text)', fontWeight: 500 }}>Add your wallet addresses</Link>
          {' '}to start accepting crypto payments.
        </p>
      )}
    </div>
  );
}
