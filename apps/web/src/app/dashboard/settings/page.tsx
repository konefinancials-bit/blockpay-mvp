'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMerchantStore } from '@/stores/merchant-store';
import { useAuthStore } from '@/stores/auth-store';
import { SUPPORTED_COINS } from '@/lib/coins';
import { PLANS } from '@/lib/stripe';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { merchant, updateWallets, updateSettings } = useMerchantStore();
  const [wallets, setWallets] = useState<Record<string, string>>(merchant?.wallets ?? {});
  const [autoSettle, setAutoSettle] = useState(merchant?.autoSettle ?? false);
  const [businessName, setBusinessName] = useState(merchant?.businessName ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateWallets(user.uid, wallets);
      await updateSettings(user.uid, { businessName, autoSettle });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const plan = merchant ? PLANS[merchant.plan as keyof typeof PLANS] : null;

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Business profile */}
        <Card>
          <h2 className="font-bold mb-4">Business Profile</h2>
          <div className="space-y-4">
            <Input label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <div>
              <label className="block text-sm text-bp-text-sec mb-1.5 font-medium">Email</label>
              <div className="px-4 py-3 rounded-xl bg-bp-bg border border-bp-border text-bp-text-sec text-sm">{merchant?.email}</div>
            </div>
          </div>
        </Card>

        {/* Wallet addresses */}
        <Card>
          <h2 className="font-bold mb-2">Wallet Addresses</h2>
          <p className="text-xs text-bp-text-sec mb-4">Payments go directly to these addresses — non-custodial. Only add coins you want to accept.</p>
          <div className="space-y-3">
            {SUPPORTED_COINS.map((coin) => (
              <div key={coin.id}>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <span style={{ color: coin.color }}>{coin.emoji}</span>
                  {coin.name} ({coin.symbol})
                  <span className="text-xs text-bp-text-dim font-normal">— {coin.network}</span>
                </label>
                <input
                  placeholder={`Your ${coin.symbol} address`}
                  value={wallets[coin.id] ?? ''}
                  onChange={(e) => setWallets((w) => ({ ...w, [coin.id]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-bp-bg border border-bp-border text-white placeholder-bp-text-dim focus:outline-none focus:border-bp-purple text-sm font-mono"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Settlement */}
        <Card>
          <h2 className="font-bold mb-4">Settlement</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm">Auto-settle to USDC daily</div>
              <div className="text-xs text-bp-text-sec mt-0.5">Automatically convert received crypto to USDC at end of day (Business plan+)</div>
            </div>
            <button
              onClick={() => setAutoSettle(!autoSettle)}
              disabled={merchant?.plan === 'starter'}
              className={`relative w-12 h-6 rounded-full transition-all ${autoSettle ? 'bg-bp-purple' : 'bg-bp-border'} disabled:opacity-40`}
            >
              <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${autoSettle ? 'left-7' : 'left-1'}`} />
            </button>
          </label>
        </Card>

        {/* Subscription */}
        <Card>
          <h2 className="font-bold mb-4">Subscription</h2>
          {plan ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold capitalize">{merchant?.plan} Plan</div>
                <div className="text-sm text-bp-text-sec">${plan.price}/mo · {plan.fee}% transaction fee</div>
                {plan.txLimit > 0 && <div className="text-xs text-bp-text-dim mt-0.5">Up to {plan.txLimit} transactions/mo</div>}
              </div>
              <a href="/api/stripe/checkout?plan=business" className="text-sm text-bp-purple hover:underline">Upgrade</a>
            </div>
          ) : (
            <p className="text-bp-text-dim text-sm">No active plan</p>
          )}
        </Card>

        <Button onClick={handleSave} loading={saving} size="lg" className="w-full">
          {saved ? <><Check className="size-4" />Saved!</> : <><Save className="size-4" />Save Settings</>}
        </Button>
      </div>
    </div>
  );
}
