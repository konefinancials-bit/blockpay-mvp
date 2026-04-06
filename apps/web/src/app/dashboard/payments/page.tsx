'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { StatusBadge } from '@/components/ui/Badge';
import { PaymentRow } from '@/components/dashboard/PaymentRow';
import { useMerchantStore } from '@/stores/merchant-store';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

const STATUSES = ['all', 'waiting', 'confirming', 'confirmed', 'finished', 'failed', 'expired'];

export default function PaymentsPage() {
  const { payments, paymentsLoading } = useMerchantStore();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (search && !p.orderId.toLowerCase().includes(search.toLowerCase()) && !p.payCurrency.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [payments, status, search]);

  const totalVolume = useMemo(() =>
    payments.filter((p) => ['confirmed', 'finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0),
    [payments]
  );

  return (
    <div>
      <Topbar title="Payments" />
      <div className="p-6 space-y-5 max-w-5xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-black gradient-text">{payments.length}</div>
            <div className="text-xs text-bp-text-dim mt-1">Total Payments</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-bp-green">${totalVolume.toFixed(2)}</div>
            <div className="text-xs text-bp-text-dim mt-1">Confirmed Volume</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-bp-purple">
              {payments.length > 0 ? ((payments.filter((p) => ['confirmed', 'finished'].includes(p.status)).length / payments.length) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-bp-text-dim mt-1">Conversion Rate</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-bp-text-dim" />
            <input placeholder="Search order ID or coin..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bp-surface border border-bp-border text-white placeholder-bp-text-dim focus:outline-none focus:border-bp-purple text-sm" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-bp-surface border border-bp-border text-bp-text-sec text-sm focus:outline-none focus:border-bp-purple capitalize">
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
          </select>
        </div>

        {/* Payment list */}
        <Card>
          {paymentsLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-bp-text-dim text-sm">No payments match your filters</div>
          ) : (
            filtered.map((p) => <PaymentRow key={p.id} payment={p} />)
          )}
        </Card>
      </div>
    </div>
  );
}
