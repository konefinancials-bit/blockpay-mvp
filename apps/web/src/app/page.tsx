'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check, X, ChevronRight, ArrowRight, Menu, ExternalLink, Zap, Shield, Globe, Nfc } from 'lucide-react';

/* ── Coin data for the live FX demo ── */
const DEMO_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Native', hex: '#F7931A', emoji: '₿', base: 65420 },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', hex: '#627EEA', emoji: 'Ξ', base: 3180 },
  { symbol: 'USDC', name: 'USD Coin', network: 'Stablecoin', hex: '#2775CA', emoji: '$', base: 1 },
  { symbol: 'SOL', name: 'Solana', network: 'Native', hex: '#9945FF', emoji: '◎', base: 155 },
];

function useTicker(base: number) {
  const [price, setPrice] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setPrice((p) => parseFloat((p * (1 + (Math.random() - 0.5) * 0.002)).toFixed(base < 2 ? 4 : 2))), 3000);
    return () => clearInterval(t);
  }, [base]);
  return price;
}

function LiveCoinRow({ coin, amountUsd }: { coin: (typeof DEMO_COINS)[0]; amountUsd: number }) {
  const price = useTicker(coin.base);
  const crypto = price > 0 ? (amountUsd / price).toFixed(price < 2 ? 2 : 6).replace(/\.?0+$/, '') : '—';
  return (
    <button className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = coin.hex + '55'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>
      <div className="size-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-all"
        style={{ background: coin.hex + '18', border: `1.5px solid ${coin.hex}30`, color: coin.hex }}>
        {coin.emoji}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-semibold text-white">{coin.name}</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{coin.symbol} · {coin.network}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-white tabular-nums">{crypto} {coin.symbol}</div>
        <div className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>${price.toLocaleString()}</div>
      </div>
    </button>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); setEmail(''); }
  };

  return (
    <div className="min-h-screen" style={{ background: '#060608', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(6,6,8,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Nfc className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight">BlockPay</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {['#how', '#hardware', '#pricing', '#investors'].map((href) => (
              <a key={href} href={href} className="hover:text-white transition-colors capitalize">{href.replace('#', '')}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-[13px] px-4 py-2 rounded-xl transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>Sign in</Link>
            <Link href="/auth/signup" className="text-[13px] px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.35)' }}>
              Get early access
            </Link>
          </div>

          <button className="md:hidden" style={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="size-5" />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-6 py-4 space-y-3 border-t" style={{ background: '#0d0d12', borderColor: 'rgba(255,255,255,0.06)' }}>
            {['#how', '#hardware', '#pricing', '#investors'].map((href) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-2 capitalize" style={{ color: 'rgba(255,255,255,0.6)' }}>{href.replace('#', '')}</a>
            ))}
            <Link href="/auth/signup" className="block text-center mt-2 py-3 rounded-xl font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>Get early access</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(109,40,217,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[12px] font-semibold"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            <span className="size-1.5 rounded-full animate-pulse" style={{ background: '#a78bfa' }} />
            Pre-launch · Seed round open · Q3 2026
          </div>

          <h1 className="font-black tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}>
            Tap. Pay.<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Any crypto.
            </span>
          </h1>

          <p className="text-[18px] leading-relaxed mb-3 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            BlockPay turns a physical NFC device into a crypto payment terminal. Customers tap their phone — a live payment page opens, they pick their coin, done.
          </p>
          <p className="text-[14px] mb-10" style={{ color: 'rgba(255,255,255,0.3)' }}>No app. No QR code. No card reader.</p>

          {/* Waitlist form */}
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 max-w-md mx-auto">
            {!submitted ? (
              <>
                <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full sm:w-auto px-5 py-3.5 rounded-2xl text-[14px] outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button type="submit" className="w-full sm:w-auto whitespace-nowrap px-6 py-3.5 rounded-2xl text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
                  Join the waitlist
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-medium w-full justify-center"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                <Check className="size-4" /> You&apos;re on the list. We&apos;ll reach out before launch.
              </div>
            )}
          </form>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {['🔒 Non-custodial', '⚡ No customer app', '🌐 50+ coins', '📈 $28T POS market'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-12 px-6 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: '580M+', l: 'Crypto holders globally' },
            { v: '$28T', l: 'Annual POS volume' },
            { v: '567%', l: 'Payment growth 2020–24' },
            { v: '<0.1%', l: 'Crypto share of POS' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[32px] font-black mb-1.5" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.v}</div>
              <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#a78bfa' }}>The Problem</p>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>Accepting crypto in person<br />is still a mess.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '✕', title: 'QR codes are clunky', desc: 'Customers open a wallet, scan, type amounts — checkout takes 90 seconds. Nobody has time for that.' },
              { icon: '✕', title: 'Custodial gateways are a liability', desc: "BitPay and Coinbase Commerce hold your funds. You're trusting a third party with your revenue." },
              { icon: '✕', title: 'No multi-coin support', desc: 'Most tools support 1–3 coins. Your customer pays in SOL, you only take BTC. Sale lost.' },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,82,82,0.04)', border: '1px solid rgba(255,82,82,0.1)' }}>
                <div className="size-10 rounded-xl flex items-center justify-center mb-4 text-[15px] font-black" style={{ background: 'rgba(255,82,82,0.1)', color: '#ff5252' }}>{p.icon}</div>
                <h3 className="font-bold mb-2 text-[14px]" style={{ color: '#ff6b6b' }}>{p.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#60a5fa' }}>How it works</p>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>From setup to first payment<br />in under 10 minutes.</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { n: '1', emoji: '📦', title: 'Order a device', desc: 'Choose a counter puck, NFC card, or table sticker. Ships pre-programmed.' },
              { n: '2', emoji: '🖥', title: 'Set your price', desc: 'Enter the amount on your dashboard. The device updates instantly.' },
              { n: '3', emoji: '📱', title: 'Customer taps', desc: 'Their phone opens your payment page with live rates for every coin.' },
              { n: '4', emoji: '✓', title: 'You get paid', desc: 'On-chain confirmation in seconds. Settle in crypto or USDC daily.' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="size-7 rounded-full flex items-center justify-center text-[12px] font-black mb-5"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>{s.n}</div>
                <div className="text-[28px] mb-3">{s.emoji}</div>
                <h3 className="font-bold text-[14px] mb-2">{s.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE FX DEMO ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#a78bfa' }}>Live FX Engine</p>
            <h2 className="font-black tracking-tight mb-5" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>Customers pay in their coin.<br /><span style={{ color: 'rgba(255,255,255,0.55)' }}>You get the dollar amount.</span></h2>
            <ul className="space-y-4">
              {[
                'Rates from live oracle feeds, updated every 5 seconds',
                'Volatility protection — lock the USD price at checkout',
                'Every transaction logged with FX rate at time of payment',
                'Hold crypto or auto-settle to USDC daily',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <span className="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(52,211,153,0.15)' }}>
                    <Check className="size-3 text-emerald-400" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment page mockup */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.15), transparent 70%)' }} />
            <div className="relative rounded-3xl overflow-hidden p-6" style={{ background: 'rgba(13,13,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              {/* Mock header bar */}
              <div className="flex items-center gap-1.5 mb-5">
                {['#ff5f57','#febc2e','#28c840'].map((c) => <div key={c} className="size-2.5 rounded-full" style={{ background: c }} />)}
                <div className="flex-1 mx-3 h-5 rounded-md text-center text-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                  blockpay.live/pay/houston-tx
                </div>
              </div>
              {/* Amount */}
              <div className="text-center mb-5">
                <div className="text-[11px] mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Amount due</div>
                <div className="text-[38px] font-black">$49.00</div>
                <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>BlockPay demo · Houston TX</div>
              </div>
              {/* Live coins */}
              <div className="space-y-2">
                {DEMO_COINS.map((c) => <LiveCoinRow key={c.symbol} coin={c} amountUsd={49} />)}
              </div>
              <div className="mt-4 text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>🔒 Non-custodial · No account needed · Powered by BlockPay</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HARDWARE ── */}
      <section id="hardware" className="py-28 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#60a5fa' }}>The Hardware</p>
            <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>One tap. Three form factors.</h2>
            <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.4)' }}>All devices ship pre-programmed. No technical setup required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Counter Puck', tag: 'Best seller', emoji: '🔵', desc: 'Sits on your counter. Customer taps their phone on the top. Payment page opens instantly.', specs: '88mm · NFC ISO 14443 · Matte black', price: 'From $59', tagColor: '#60a5fa' },
              { name: 'NFC Card', tag: '', emoji: '💳', desc: 'Standard credit card size. Hand it to a customer or mount it in a cardholder.', specs: 'CR80 · Metal option · Custom print', price: 'From $18', tagColor: '' },
              { name: 'Table Sticker', tag: '', emoji: '⭕', desc: 'Weatherproof adhesive disc. Stick it on a table, menu, or receipt tray.', specs: '60mm · Waterproof · Bulk pricing', price: 'From $8', tagColor: '' },
            ].map((h) => (
              <div key={h.name} className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {h.tag && (
                  <span className="self-start text-[10px] font-bold px-2.5 py-1 rounded-full mb-4" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: h.tagColor }}>{h.tag}</span>
                )}
                <div className="text-[40px] mb-4">{h.emoji}</div>
                <h3 className="font-bold text-[17px] mb-2">{h.name}</h3>
                <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{h.desc}</p>
                <div className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>{h.specs}</div>
                <div className="text-[18px] font-black" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{h.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>Built for any business<br />that wants crypto payments.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: '☕', title: 'Retail & Hospitality', desc: 'Cafés, bars, boutiques, pop-ups. Counter puck lives on the register.', chip: 'Counter puck & sticker' },
              { emoji: '💻', title: 'Freelancers & Agencies', desc: 'International clients, no bank friction. Hand them an NFC card.', chip: 'NFC card format' },
              { emoji: '🏢', title: 'Brands & Franchises', desc: 'White-label the whole platform. Your logo, your domain — BlockPay inside.', chip: 'White-label tier' },
            ].map((w) => (
              <div key={w.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[36px] mb-4">{w.emoji}</div>
                <h3 className="font-bold text-[16px] mb-2">{w.title}</h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{w.desc}</p>
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>{w.chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-28 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#a78bfa' }}>Why BlockPay</p>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>We built what nobody else has.</h2>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  <th className="text-left p-4 text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Feature</th>
                  {['BlockPay', 'BitPay', 'Coinbase', 'NOWPayments'].map((n, i) => (
                    <th key={n} className="p-4 text-[12px] font-bold text-center" style={{ color: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.35)' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['NFC tap-to-pay device', true, false, false, false],
                  ['Non-custodial', true, false, false, true],
                  ['Live FX at point of sale', true, 'partial', false, false],
                  ['Instant fiat settlement', true, true, false, false],
                  ['White-label platform', true, false, false, false],
                  ['No KYC for customers', true, false, false, true],
                  ['Volatility protection', true, true, false, false],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td className="p-4 text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{row[0] as string}</td>
                    {[row[1], row[2], row[3], row[4]].map((v, j) => (
                      <td key={j} className="p-4 text-center">
                        {v === true ? <Check className="size-4 text-emerald-400 mx-auto" strokeWidth={2.5} /> :
                         v === false ? <X className="size-4 mx-auto" style={{ color: 'rgba(255,255,255,0.15)' }} /> :
                         <span className="text-[11px] font-semibold" style={{ color: '#fbbf24' }}>Partial</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#60a5fa' }}>Pricing</p>
            <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>Straightforward plans.<br />No surprises.</h2>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Join the waitlist to lock in early-adopter rates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter', price: '$29', mo: '/mo', tag: '',
                features: ['1 NFC device included', 'Up to 500 transactions/mo', 'Live FX on 20+ coins', 'Merchant dashboard', '0.8% transaction fee'],
                cta: 'Start free trial', plan: 'starter', highlight: false,
              },
              {
                name: 'Business', price: '$99', mo: '/mo', tag: 'Most popular',
                features: ['5 NFC devices included', 'Unlimited transactions', 'Live FX on 50+ coins', 'Full analytics & FX history', '0.5% transaction fee', 'Auto USDC settlement'],
                cta: 'Start free trial', plan: 'business', highlight: true,
              },
              {
                name: 'White-label', price: '$499', mo: '/mo', tag: '',
                features: ['Custom branded devices', 'White-label payment page', 'API access', 'Custom coin selection', '0.3% transaction fee', 'Dedicated support'],
                cta: 'Contact sales', plan: 'whitelabel', highlight: false,
              },
            ].map((p) => (
              <div key={p.name} className="relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: p.highlight ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${p.highlight ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: p.highlight ? '0 0 40px rgba(124,58,237,0.15)' : 'none',
                }}>
                {p.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>{p.tag}</div>
                )}
                <div className="mb-1 text-[15px] font-bold" style={{ color: p.highlight ? '#c4b5fd' : 'rgba(255,255,255,0.7)' }}>{p.name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-[44px] font-black leading-none">{p.price}</span>
                  <span className="text-[14px] pb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.mo}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <Check className="size-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/auth/signup?plan=${p.plan}`}
                  className="block text-center py-3 rounded-xl text-[14px] font-semibold transition-all hover:-translate-y-0.5"
                  style={p.highlight
                    ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Hardware sold separately. All plans include free onboarding. Cancel any time.</p>
        </div>
      </section>

      {/* ── FOUNDER QUOTE ── */}
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="size-16 rounded-full mx-auto mb-6 flex items-center justify-center text-[20px] font-black"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>KR</div>
          <blockquote className="text-[17px] font-medium leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            &ldquo;I noticed how technology is advancing every industry, and I wanted to create something that has real value and will greatly impact the crypto market. The gap between crypto&apos;s potential and everyday merchant adoption is still massive — BlockPay is how we close it.&rdquo;
          </blockquote>
          <div className="font-bold">Keilan Robinson</div>
          <div className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Founder & CEO · Age 22 · Tucker, GA · Self-employed since 18</div>
          <a href="mailto:keilan@blockpay.live" className="text-[13px] mt-2 inline-block" style={{ color: '#a78bfa' }}>keilan@blockpay.live</a>
        </div>
      </section>

      {/* ── INVESTOR CTA ── */}
      <section id="investors" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 60%)' }} />
            <div className="relative">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#a78bfa' }}>The Vision</p>
              <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>Pre-launch. $15M seed round<br />open now.</h2>
              <p className="text-[15px] mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Engineering 40% · Marketing 25% · Compliance 20% · Ops 15%</p>

              <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto mb-10">
                {[{ v: '$15M', l: 'Round target' }, { v: 'Q3 2026', l: 'Target launch' }, { v: '$5.2M', l: 'ARR Year 3' }].map((s) => (
                  <div key={s.l}>
                    <div className="text-[22px] font-black" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.v}</div>
                    <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:keilan@blockpay.live?subject=BlockPay%20Investor%20Inquiry"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
                  Request pitch deck <ExternalLink className="size-4" />
                </a>
                <Link href="/auth/signup"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[14px] font-medium transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  Join merchant waitlist <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Nfc className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[15px]">BlockPay</span>
          </div>
          <p className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 BlockPay LLC, Tucker, Georgia. Building the infrastructure for crypto at the register.
          </p>
          <div className="flex items-center gap-5 text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <a href="mailto:keilan@blockpay.live" className="hover:text-white transition-colors">Contact</a>
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
