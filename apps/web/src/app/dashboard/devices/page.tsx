'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Nfc, Copy, Check, ExternalLink, QrCode } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMerchantStore } from '@/stores/merchant-store';
import { useAuthStore } from '@/stores/auth-store';

const DEVICE_TYPES = [
  { id: 'puck', label: 'Counter Puck', emoji: '🔵', desc: 'Sits on your counter' },
  { id: 'card', label: 'NFC Card', emoji: '💳', desc: 'Credit card size' },
  { id: 'sticker', label: 'Table Sticker', emoji: '⭕', desc: 'Weatherproof adhesive' },
];

export default function DevicesPage() {
  const { user } = useAuthStore();
  const { devices, addDevice, fetchDevices } = useMerchantStore();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'puck' | 'card' | 'sticker'>('puck');
  const [defaultAmount, setDefaultAmount] = useState('');
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live';

  const handleAdd = async () => {
    if (!user || !name.trim()) return;
    setAdding(true);
    const deviceId = `${user.uid}-${Date.now()}`;
    const paymentUrl = `${appUrl}/pay/${user.uid}?device=${deviceId}${defaultAmount ? `&amount=${defaultAmount}` : ''}`;
    try {
      await addDevice(user.uid, {
        name: name.trim(),
        type,
        paymentUrl,
        defaultAmount: defaultAmount ? parseFloat(defaultAmount) : undefined,
        active: true,
        createdAt: new Date().toISOString(),
      });
      await fetchDevices(user.uid);
      setName(''); setDefaultAmount(''); setShowAdd(false);
    } finally {
      setAdding(false);
    }
  };

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <Topbar title="Devices" />
      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-bp-text-sec text-sm">Manage your NFC payment devices. Each device has a unique payment URL.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="size-4" />Add Device</Button>
        </div>

        {/* Add device form */}
        {showAdd && (
          <Card glow>
            <h3 className="font-bold mb-4">New Device</h3>
            <div className="space-y-4">
              <Input label="Device name" placeholder="Front counter" value={name} onChange={(e) => setName(e.target.value)} />
              <div>
                <label className="block text-sm text-bp-text-sec mb-2 font-medium">Device type</label>
                <div className="grid grid-cols-3 gap-3">
                  {DEVICE_TYPES.map((t) => (
                    <button key={t.id} onClick={() => setType(t.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${type === t.id ? 'border-bp-purple bg-bp-purple/10 text-white' : 'border-bp-border text-bp-text-sec hover:border-bp-purple/30'}`}>
                      <div className="text-2xl mb-1">{t.emoji}</div>
                      <div className="text-xs font-semibold">{t.label}</div>
                      <div className="text-[10px] text-bp-text-dim">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Default amount (optional)" placeholder="Leave blank for merchant-set amounts" type="number" value={defaultAmount} onChange={(e) => setDefaultAmount(e.target.value)} />
              <div className="flex gap-3">
                <Button onClick={handleAdd} loading={adding}>Create Device</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Info box */}
        <Card>
          <div className="flex items-start gap-3">
            <Nfc className="size-5 text-bp-purple shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">How to program your NFC device</h3>
              <p className="text-sm text-bp-text-sec">Use any NFC writing app (e.g. NFC Tools on iOS/Android) to write the payment URL to your device. The URL opens in any browser — no app required for your customers.</p>
            </div>
          </div>
        </Card>

        {/* Device list */}
        {devices.length === 0 ? (
          <Card className="text-center py-12">
            <Nfc className="size-10 text-bp-text-dim mx-auto mb-3" />
            <p className="text-bp-text-sec text-sm">No devices yet. Add your first NFC device above.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {devices.map((device) => {
              const typeInfo = DEVICE_TYPES.find((t) => t.id === device.type);
              return (
                <Card key={device.id}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">{typeInfo?.emoji ?? '🔵'}</div>
                    <div className="flex-1">
                      <div className="font-bold">{device.name}</div>
                      <div className="text-xs text-bp-text-dim">{typeInfo?.label ?? device.type}</div>
                      {device.defaultAmount && <div className="text-xs text-bp-purple mt-0.5">Default: ${device.defaultAmount}</div>}
                    </div>
                    <div className={`size-2 rounded-full mt-1 ${device.active ? 'bg-bp-green' : 'bg-red-500'}`} />
                  </div>

                  {/* Payment URL */}
                  <div className="bg-bp-bg rounded-xl p-3 mb-3">
                    <div className="text-xs text-bp-text-dim mb-1">Payment URL</div>
                    <div className="text-xs font-mono text-bp-cyan truncate">{device.paymentUrl}</div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(device.paymentUrl, device.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-bp-border hover:border-bp-purple/50 text-xs font-medium text-bp-text-sec hover:text-white transition-all">
                      {copied === device.id ? <Check className="size-3 text-bp-green" /> : <Copy className="size-3" />}
                      {copied === device.id ? 'Copied!' : 'Copy URL'}
                    </button>
                    <a href={device.paymentUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bp-border hover:border-bp-cyan/50 text-xs font-medium text-bp-text-sec hover:text-white transition-all">
                      <ExternalLink className="size-3" />Test
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
