'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';
import {
  Wallet, Smartphone, CreditCard, Nfc, Plus, Download,
  Check, Copy, ExternalLink, Zap, QrCode, RefreshCw,
} from 'lucide-react';
import { SUPPORTED_COINS } from '@/lib/coins';

// ── Embedded wallet providers ──
const WALLET_PROVIDERS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    desc: 'The most popular Ethereum wallet. Works with ETH, USDC, USDT, MATIC.',
    emoji: '🦊',
    color: '#F6851B',
    deeplink: 'https://metamask.io/download/',
    chains: ['ETH', 'USDC', 'USDT', 'MATIC'],
  },
  {
    id: 'phantom',
    name: 'Phantom',
    desc: 'Best-in-class Solana wallet. Also supports Bitcoin and Ethereum.',
    emoji: '👻',
    color: '#9945FF',
    deeplink: 'https://phantom.app/',
    chains: ['SOL', 'BTC', 'ETH'],
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    desc: 'Self-custody wallet from Coinbase. Supports 100,000+ assets.',
    emoji: '🔵',
    color: '#0052FF',
    deeplink: 'https://www.coinbase.com/wallet',
    chains: ['BTC', 'ETH', 'SOL', 'USDC', 'DOGE', 'LTC'],
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    desc: 'Multi-chain wallet supporting 100+ blockchains. Official Binance wallet.',
    emoji: '🛡',
    color: '#3375BB',
    deeplink: 'https://trustwallet.com/',
    chains: ['BTC', 'ETH', 'BNB', 'SOL', 'AVAX', 'MATIC', 'DOGE'],
  },
  {
    id: 'exodus',
    name: 'Exodus',
    desc: 'Beautiful desktop & mobile wallet with built-in exchange.',
    emoji: '⚡',
    color: '#0B4EFF',
    deeplink: 'https://www.exodus.com/',
    chains: ['BTC', 'ETH', 'SOL', 'USDC', 'AVAX', 'LTC', 'DOGE'],
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    desc: 'The fun & friendly Ethereum wallet. Great for DeFi and NFTs.',
    emoji: '🌈',
    color: '#174299',
    deeplink: 'https://rainbow.me/',
    chains: ['ETH', 'USDC', 'USDT', 'MATIC', 'AVAX'],
  },
];

function WalletCard({ wallet }: { wallet: typeof WALLET_PROVIDERS[0] }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: wallet.color + '18', border: `1.5px solid ${wallet.color}30` }}>
          {wallet.emoji}
        </div>
        <div className="flex-1">
          <div className="font-bold text-[15px]">{wallet.name}</div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {wallet.chains.slice(0, 4).map((c) => (
              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{c}</span>
            ))}
            {wallet.chains.length > 4 && <span className="text-[10px] text-white/30">+{wallet.chains.length - 4}</span>}
          </div>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{wallet.desc}</p>
      <a href={wallet.deeplink} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
        style={{ background: wallet.color + '22', border: `1px solid ${wallet.color}40` }}>
        <ExternalLink className="size-3.5" />Open {wallet.name}
      </a>
    </div>
  );
}

interface WalletCardGenProps {
  merchantId: string;
  businessName: string;
  plan: string;
}

function WalletCardGenerator({ merchantId, businessName, plan }: WalletCardGenProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [cardType, setCardType] = useState<'apple' | 'google'>('apple');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live';
  const payUrl = `${appUrl}/pay/${merchantId}`;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerated(true);
    setGenerating(false);
  };

  return (
    <div className="space-y-5">
      {/* Card preview */}
      <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ width: 340, height: 200, background: 'linear-gradient(135deg, #1a0533, #0d0720)', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 20px 60px rgba(124,58,237,0.3)' }}>
        {/* Glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.3), transparent 60%)' }} />
        {/* NFC chip */}
        <div className="absolute top-6 right-6 size-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Nfc className="size-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>
        {/* Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Nfc className="size-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm text-white">BlockPay</span>
        </div>
        {/* Business name */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Merchant</div>
          <div className="font-bold text-white text-[16px]">{businessName}</div>
          <div className="text-[10px] mt-1 font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{payUrl.replace('https://', '')}</div>
        </div>
        {/* Plan badge */}
        <div className="absolute bottom-6 right-6">
          <span className="text-[9px] font-bold px-2 py-1 rounded-full capitalize" style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', color: '#c4b5fd' }}>{plan}</span>
        </div>
      </div>

      {/* Platform selector */}
      <div className="flex gap-3">
        {[
          { id: 'apple' as const, label: 'Apple Wallet', emoji: '' },
          { id: 'google' as const, label: 'Google Wallet', emoji: '🟡' },
        ].map((p) => (
          <button key={p.id} onClick={() => setCardType(p.id)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={cardType === p.id
              ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      <Button onClick={handleGenerate} loading={generating} className="w-full" size="lg">
        {generated ? <><Check className="size-4" />Card ready — tap to download</> : <><Download className="size-4" />Generate {cardType === 'apple' ? 'Apple' : 'Google'} Wallet Card</>}
      </Button>

      {generated && (
        <div className="rounded-xl p-4 text-[13px]" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="font-semibold text-emerald-400 mb-2">✓ Your merchant wallet card is ready</div>
          <ul className="space-y-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <li>• Share with customers — they tap or scan to pay</li>
            <li>• Add to your {cardType === 'apple' ? 'iPhone' : 'Android'} for quick access</li>
            <li>• Card automatically shows your live payment URL</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function NFCCardSection({ merchantId }: { merchantId: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blockpay.live';
  const payUrl = `${appUrl}/pay/${merchantId}`;
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Program any blank NFC tag or card with your payment URL. Customers tap → browser opens → they pay. Works with any NFC writer app.
      </p>

      {/* URL to program */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Your NFC payment URL</div>
        <div className="font-mono text-[13px] text-white break-all mb-3">{payUrl}</div>
        <button onClick={async () => { await navigator.clipboard.writeText(payUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-2 text-[12px] font-semibold px-3 py-2 rounded-lg transition-all"
          style={{ background: copied ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#34d399' : 'rgba(255,255,255,0.6)' }}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>

      {/* NFC writer app links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'NFC Tools (iOS)', url: 'https://apps.apple.com/app/nfc-tools/id1252962749', emoji: '📱' },
          { name: 'NFC Tools (Android)', url: 'https://play.google.com/store/apps/details?id=com.wakdev.wdnfc', emoji: '🤖' },
        ].map((app) => (
          <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-xl text-[12px] font-medium transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
            <span>{app.emoji}</span>{app.name}
          </a>
        ))}
      </div>

      {/* Hardware order CTA */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
        <Nfc className="size-8 shrink-0" style={{ color: '#a78bfa' }} />
        <div>
          <div className="font-semibold text-[13px]">Want pre-programmed hardware?</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Counter pucks from $59 · NFC cards from $18 · Stickers from $8</div>
        </div>
        <a href="mailto:keilan@blockpay.live?subject=Hardware Order" className="shrink-0 text-[12px] font-semibold" style={{ color: '#a78bfa' }}>Order →</a>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuthStore();
  const { merchant } = useMerchantStore();
  const [tab, setTab] = useState<'wallets' | 'cards' | 'nfc'>('wallets');

  const TABS = [
    { id: 'wallets' as const, label: 'Crypto Wallets', icon: Wallet },
    { id: 'cards' as const, label: 'Wallet Cards', icon: CreditCard },
    { id: 'nfc' as const, label: 'NFC Setup', icon: Nfc },
  ];

  return (
    <div>
      <Topbar title="Wallet & Cards" />
      <div className="p-6 space-y-6 max-w-4xl mx-auto pb-24">

        {/* Header */}
        <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.05))', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Wallet className="size-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[18px] mb-1">Wallets & Tap-to-Pay</h2>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Connect your preferred crypto wallet, generate Apple/Google Wallet merchant cards, and set up NFC devices for tap-to-pay in store.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={tab === id
                ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
              <Icon className="size-3.5" />{label}
            </button>
          ))}
        </div>

        {/* ── WALLETS TAB ── */}
        {tab === 'wallets' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px]">Supported Wallets</h3>
                <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Use any of these wallets to receive crypto payments directly — no middleman.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {WALLET_PROVIDERS.map((w) => <WalletCard key={w.id} wallet={w} />)}
            </div>

            {/* How it works */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold mb-4 text-[14px]">How non-custodial payments work</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: '1', title: 'Customer taps NFC', desc: 'Their phone opens your payment page with live crypto rates.' },
                  { n: '2', title: 'They send crypto', desc: 'Directly from their wallet to your address — no intermediary.' },
                  { n: '3', title: 'You receive instantly', desc: 'Crypto lands in your wallet in seconds. You own your keys.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3">
                    <div className="size-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>{s.n}</div>
                    <div>
                      <div className="font-semibold text-[13px] mb-1">{s.title}</div>
                      <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WALLET CARDS TAB ── */}
        {tab === 'cards' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[16px]">Merchant Wallet Card</h3>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Generate a digital card for Apple Wallet or Google Wallet. Share it with customers or use it to quickly open your payment page.
              </p>
            </div>
            <Card>
              <WalletCardGenerator
                merchantId={user?.uid ?? 'demo'}
                businessName={merchant?.businessName ?? 'Your Business'}
                plan={merchant?.plan ?? 'starter'}
              />
            </Card>

            {/* What customers see */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold mb-3 text-[14px]">What your customers can do with the card</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Smartphone, title: 'Add to their phone wallet', desc: 'Tap the card to instantly open your payment page — no app needed.' },
                  { icon: Nfc, title: 'Tap in store', desc: 'If they have the card added, one tap pays. Ultra-fast checkout.' },
                  { icon: QrCode, title: 'Scan a QR code', desc: 'Share the card as a QR code for remote or online payments.' },
                  { icon: Zap, title: 'Live crypto rates', desc: 'Every time they open the card, they see real-time exchange rates.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Icon className="size-5 shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <div>
                      <div className="font-semibold text-[13px]">{title}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NFC TAB ── */}
        {tab === 'nfc' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[16px]">NFC Tap-to-Pay Setup</h3>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Program any NFC tag, card, or device with your payment URL. Customers tap → pay. No app required on their side.
              </p>
            </div>
            <Card>
              <NFCCardSection merchantId={user?.uid ?? 'demo'} />
            </Card>

            {/* Compatible devices */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold mb-4 text-[14px]">Compatible NFC form factors</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { emoji: '🔵', name: 'Counter Puck', desc: '88mm NFC ISO 14443. Sits on register. From $59.', highlight: true },
                  { emoji: '💳', name: 'NFC Card', desc: 'Credit card size. Hand to customer or mount. From $18.', highlight: false },
                  { emoji: '⭕', name: 'Table Sticker', desc: '60mm weatherproof disc. Stick anywhere. From $8.', highlight: false },
                  { emoji: '🏷', name: 'Blank NFC Tags', desc: 'Buy cheap tags ($0.30 each) and program yourself.', highlight: false },
                  { emoji: '📱', name: 'Android NFC Share', desc: 'Android phones can act as NFC tags via apps.', highlight: false },
                  { emoji: '🖼', name: 'NFC Poster/Frame', desc: 'Large format. Great for menus, windows, events.', highlight: false },
                ].map((d) => (
                  <div key={d.name} className="rounded-xl p-4" style={{ background: d.highlight ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${d.highlight ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
                    <div className="text-2xl mb-2">{d.emoji}</div>
                    <div className="font-semibold text-[13px] mb-1">{d.name}</div>
                    <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
