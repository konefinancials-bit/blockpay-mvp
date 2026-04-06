'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone, Zap, Shield, Globe, Check, X, ChevronRight,
  BarChart3, Nfc, DollarSign, Star, ArrowRight, Menu, ExternalLink,
} from 'lucide-react';

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', emoji: '₿', color: '#F7931A', amount: '0.000745 BTC' },
  { symbol: 'ETH', name: 'Ethereum', emoji: 'Ξ', color: '#627EEA', amount: '0.0158 ETH' },
  { symbol: 'USDC', name: 'USD Coin', emoji: '$', color: '#2775CA', amount: '49.02 USDC' },
  { symbol: 'SOL', name: 'Solana', emoji: '◎', color: '#9945FF', amount: '0.312 SOL' },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  return (
    <div className="min-h-screen bg-bp-bg text-bp-text font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-bp-border bg-bp-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-purple-gradient flex items-center justify-center">
              <Nfc className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg">BlockPay</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-bp-text-sec">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#hardware" className="hover:text-white transition-colors">Hardware</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#investors" className="hover:text-white transition-colors">Investors</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-bp-text-sec hover:text-white transition-colors px-4 py-2">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary px-4 py-2 text-sm">Get early access</Link>
          </div>
          <button className="md:hidden text-bp-text-sec" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="size-5" />
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-bp-surface border-t border-bp-border px-6 py-4 space-y-3">
            <a href="#how" className="block text-bp-text-sec hover:text-white py-2">How it works</a>
            <a href="#hardware" className="block text-bp-text-sec hover:text-white py-2">Hardware</a>
            <a href="#pricing" className="block text-bp-text-sec hover:text-white py-2">Pricing</a>
            <Link href="/auth/signup" className="block btn-primary px-4 py-2 text-sm text-center mt-2">Get early access</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-bp-purple/30 bg-bp-purple/10 text-bp-purple text-xs font-semibold mb-6">
            <span className="size-1.5 rounded-full bg-bp-cyan animate-pulse-slow" />
            Pre-launch · Seed round open · Q3 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Tap. Pay.<br />
            <span className="gradient-text">Any crypto.</span>
          </h1>
          <p className="text-xl text-bp-text-sec max-w-2xl mx-auto mb-4 leading-relaxed">
            BlockPay turns a physical NFC device into a crypto payment terminal. Customers tap their phone — a live payment page opens, they pick their coin, done.
          </p>
          <p className="text-bp-text-dim text-sm mb-10">No app. No QR code. No card reader.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <form onSubmit={handleWaitlist} className="flex gap-2 w-full max-w-md">
              {!submitted ? (
                <>
                  <input
                    type="email" required placeholder="your@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-bp-surface border border-bp-border text-white placeholder-bp-text-dim focus:outline-none focus:border-bp-purple text-sm"
                  />
                  <button type="submit" className="btn-primary px-6 py-3 text-sm whitespace-nowrap">
                    Join waitlist
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-bp-green/10 border border-bp-green/30 text-bp-green text-sm">
                  <Check className="size-4" /> You're on the list! We'll be in touch.
                </div>
              )}
            </form>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Crypto holders', value: '580M+' },
              { label: 'Annual POS volume', value: '$28T' },
              { label: 'Payment growth', value: '567%' },
              { label: 'Crypto share of POS', value: '<0.1%' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <div className="text-2xl font-black gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-bp-text-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-bp-purple text-sm font-semibold uppercase tracking-wider mb-3">The Problem</p>
            <h2 className="text-4xl font-black mb-4">Accepting crypto in person<br />is still a mess.</h2>
            <p className="text-bp-text-sec max-w-xl mx-auto">Every existing solution makes the merchant do too much work, or makes the customer jump through too many hoops.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'QR codes are clunky', icon: X, desc: 'Customers have to open a wallet app, scan, type amounts — checkout takes 90 seconds. Nobody has time for that.' },
              { title: 'Custodial gateways are a liability', icon: Shield, desc: 'BitPay and Coinbase Commerce hold your funds. You\'re trusting a third party with your revenue.' },
              { title: 'No multi-coin support', icon: Globe, desc: 'Most tools only support 1–3 coins. Your customer wants to pay in SOL, you only accept BTC. Sale lost.' },
            ].map((p) => (
              <div key={p.title} className="card p-6">
                <div className="size-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <p.icon className="size-5 text-red-400" />
                </div>
                <h3 className="font-bold mb-2 text-red-400">✕ {p.title}</h3>
                <p className="text-sm text-bp-text-sec leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-bp-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-bp-cyan text-sm font-semibold uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-4xl font-black">From setup to first payment<br />in under 10 minutes.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '1', emoji: '📦', title: 'Order a device', desc: 'Choose a counter puck, NFC card, or table sticker. Ships pre-programmed to your account.' },
              { n: '2', emoji: '🖥', title: 'Set your price', desc: 'Enter the amount on your merchant dashboard. The device updates instantly — no reprogram needed.' },
              { n: '3', emoji: '📱', title: 'Customer taps', desc: 'Their phone opens a payment page. They see live rates in every supported coin and pick one.' },
              { n: '4', emoji: '✓', title: 'You get paid', desc: 'On-chain confirmation in seconds. Settle in crypto or auto-convert to USDC daily — your choice.' },
            ].map((step) => (
              <div key={step.n} className="relative">
                <div className="card p-6 h-full">
                  <div className="size-8 rounded-full bg-bp-purple/20 border border-bp-purple/30 flex items-center justify-center text-bp-purple font-bold text-sm mb-4">{step.n}</div>
                  <div className="text-3xl mb-3">{step.emoji}</div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-bp-text-sec leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live FX demo */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-bp-purple text-sm font-semibold uppercase tracking-wider mb-3">Live FX Engine</p>
            <h2 className="text-4xl font-black mb-4">Customers pay in their coin.<br />You get the dollar amount.</h2>
            <ul className="space-y-3 text-bp-text-sec text-sm">
              {[
                'Rates sourced from live oracle feeds, updated every 5 seconds',
                'Optional volatility protection — lock the USD price at checkout',
                'Every transaction logged with the FX rate at time of payment',
                'Merchant can hold crypto or auto-settle to USDC daily',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="size-4 text-bp-green shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Payment page mock */}
          <div className="card p-6 max-w-sm mx-auto w-full glow-purple">
            <div className="text-xs text-bp-text-dim mb-4">Live rates</div>
            <div className="text-center mb-6">
              <div className="text-3xl font-black mb-1">$49.00</div>
              <div className="text-xs text-bp-text-dim">BlockPay demo · Houston TX</div>
            </div>
            <div className="space-y-2">
              {COINS.map((c) => (
                <button key={c.symbol} className="w-full flex items-center gap-3 p-3 rounded-xl bg-bp-bg border border-bp-border hover:border-bp-purple/50 transition-colors group">
                  <div className="size-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: c.color + '22', border: `1px solid ${c.color}44` }}>
                    <span style={{ color: c.color }}>{c.emoji}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-bp-text-dim">{c.symbol}</div>
                  </div>
                  <div className="text-sm font-bold text-right">{c.amount}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section id="hardware" className="py-24 px-6 bg-bp-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-bp-cyan text-sm font-semibold uppercase tracking-wider mb-3">The Hardware</p>
            <h2 className="text-4xl font-black">One tap. Three form factors.</h2>
            <p className="text-bp-text-sec mt-3">All devices ship pre-programmed to your account. No technical setup required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Counter Puck', tag: 'Best seller', emoji: '🔵', desc: 'Sits on your counter. Customer taps their phone on the top. Payment page opens instantly.', specs: '88mm · NFC ISO 14443 · Matte black', price: 'From $59' },
              { name: 'NFC Card', tag: '', emoji: '💳', desc: 'Standard credit card size. Hand it to a customer or mount it in a cardholder.', specs: 'CR80 · Metal option · Custom print', price: 'From $18' },
              { name: 'Table Sticker', tag: '', emoji: '⭕', desc: 'Weatherproof adhesive disc. Stick it to a table, a menu, or a receipt tray.', specs: '60mm · Waterproof · Bulk pricing', price: 'From $8' },
            ].map((h) => (
              <div key={h.name} className="card p-6 flex flex-col">
                {h.tag && <div className="text-xs font-bold text-bp-cyan border border-bp-cyan/30 bg-bp-cyan/10 px-2 py-0.5 rounded-full self-start mb-4">{h.tag}</div>}
                <div className="text-5xl mb-4">{h.emoji}</div>
                <h3 className="font-bold text-xl mb-2">{h.name}</h3>
                <p className="text-sm text-bp-text-sec leading-relaxed mb-4 flex-1">{h.desc}</p>
                <div className="text-xs text-bp-text-dim mb-3">{h.specs}</div>
                <div className="text-lg font-black gradient-text">{h.price}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-bp-text-dim text-sm mt-6">Hardware sold separately. Included with some subscription plans.</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-bp-purple text-sm font-semibold uppercase tracking-wider mb-3">Why BlockPay</p>
            <h2 className="text-4xl font-black">We built what nobody else has.</h2>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bp-border">
                  <th className="text-left p-4 text-bp-text-sec text-sm font-semibold">Feature</th>
                  {['BlockPay', 'BitPay', 'Coinbase Commerce', 'NOWPayments'].map((name) => (
                    <th key={name} className={`p-4 text-sm font-bold text-center ${name === 'BlockPay' ? 'text-bp-purple' : 'text-bp-text-sec'}`}>{name}</th>
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
                  <tr key={i} className={`border-b border-bp-border/50 ${i % 2 === 0 ? '' : 'bg-bp-surface/30'}`}>
                    <td className="p-4 text-sm text-bp-text-sec">{row[0] as string}</td>
                    {[row[1], row[2], row[3], row[4]].map((val, j) => (
                      <td key={j} className="p-4 text-center">
                        {val === true ? <Check className="size-4 text-bp-green mx-auto" /> :
                         val === false ? <X className="size-4 text-red-500/60 mx-auto" /> :
                         <span className="text-xs text-bp-amber">Partial</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-bp-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-bp-cyan text-sm font-semibold uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-4xl font-black">Straightforward plans.<br />No surprises.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: '$29', period: '/mo', tag: '',
                features: ['1 NFC device included', 'Up to 500 transactions/mo', 'Live FX on 20+ coins', 'Merchant dashboard', '0.8% transaction fee'],
                cta: 'Start free trial', plan: 'starter',
              },
              {
                name: 'Business', price: '$99', period: '/mo', tag: 'Most popular',
                features: ['5 NFC devices included', 'Unlimited transactions', 'Live FX on 50+ coins', 'Full analytics & FX history', '0.5% transaction fee', 'Auto USDC settlement'],
                cta: 'Start free trial', plan: 'business',
              },
              {
                name: 'White-label', price: '$499', period: '/mo', tag: '',
                features: ['Custom branded devices', 'White-label payment page', 'API access', 'Custom coin selection', '0.3% transaction fee', 'Dedicated support'],
                cta: 'Contact sales', plan: 'whitelabel',
              },
            ].map((plan) => (
              <div key={plan.name} className={`card p-6 flex flex-col relative ${plan.tag ? 'border-bp-purple glow-purple' : ''}`}>
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-gradient px-3 py-1 rounded-full text-xs font-bold text-white">{plan.tag}</div>
                )}
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-bp-text-sec text-sm pb-1">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-bp-text-sec">
                      <Check className="size-4 text-bp-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/auth/signup?plan=${plan.plan}`} className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all ${plan.tag ? 'btn-primary' : 'bg-bp-bg border border-bp-border hover:border-bp-purple text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-bp-text-dim text-sm mt-6">Hardware sold separately. All plans include free onboarding. Cancel any time.</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Built for any business<br />that wants crypto payments.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '☕', title: 'Retail & Hospitality', desc: 'Cafés, bars, boutiques, pop-ups. Counter puck lives on the register. Customers tap, pay, leave.', device: 'Counter puck & table sticker' },
              { emoji: '💻', title: 'Freelancers & Agencies', desc: 'International clients, no bank friction. Hand them an NFC card at the end of a meeting.', device: 'NFC card format' },
              { emoji: '🏢', title: 'Brands & Franchises', desc: 'White-label the whole platform. Your logo, your colours, your domain — powered by BlockPay.', device: 'White-label tier' },
            ].map((w) => (
              <div key={w.title} className="card p-6">
                <div className="text-4xl mb-4">{w.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-sm text-bp-text-sec leading-relaxed mb-3">{w.desc}</p>
                <span className="text-xs text-bp-purple border border-bp-purple/30 bg-bp-purple/10 px-2 py-1 rounded-full">{w.device}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 px-6 bg-bp-surface/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="size-20 rounded-full bg-bp-surface border-2 border-bp-purple/30 mx-auto mb-6 flex items-center justify-center text-3xl">KR</div>
          <blockquote className="text-xl font-medium leading-relaxed mb-6 text-bp-text-sec">
            "I noticed how technology is advancing every industry, and I wanted to create something that has real value and will greatly impact the crypto market. The gap between crypto's potential and everyday merchant adoption is still massive — BlockPay is how we close it."
          </blockquote>
          <div>
            <div className="font-bold">Keilan Robinson</div>
            <div className="text-bp-text-dim text-sm">Founder & CEO · Age 22 · Tucker, GA · Self-employed since 18</div>
            <a href="mailto:keilan@blockpay.live" className="text-bp-purple text-sm hover:underline mt-1 inline-block">keilan@blockpay.live</a>
          </div>
        </div>
      </section>

      {/* Investors CTA */}
      <section id="investors" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
            <p className="text-bp-purple text-sm font-semibold uppercase tracking-wider mb-3">The Vision</p>
            <h2 className="text-4xl font-black mb-2">Pre-launch. $15M seed round open now.</h2>
            <p className="text-bp-text-sec max-w-xl mx-auto mb-8">Engineering 40% · Marketing 25% · Compliance 20% · Ops 15%</p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-10">
              {[{ label: 'Round target', val: '$15M' }, { label: 'Target launch', val: 'Q3 2026' }, { label: 'ARR Y3', val: '$5.2M' }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black gradient-text mb-1">{s.val}</div>
                  <div className="text-xs text-bp-text-dim">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:keilan@blockpay.live?subject=BlockPay%20Investor%20Inquiry" className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
                Request pitch deck <ExternalLink className="size-4" />
              </a>
              <Link href="/auth/signup" className="px-8 py-3 text-sm border border-bp-border rounded-xl hover:border-bp-purple transition-colors flex items-center gap-2">
                Join merchant waitlist <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bp-border py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-purple-gradient flex items-center justify-center">
              <Nfc className="size-3 text-white" />
            </div>
            <span className="font-bold">BlockPay</span>
          </div>
          <div className="text-bp-text-dim text-sm">© 2026 BlockPay. Building the infrastructure for crypto at the register.</div>
          <div className="flex items-center gap-4 text-sm text-bp-text-sec">
            <a href="mailto:keilan@blockpay.live" className="hover:text-white">Contact</a>
            <Link href="/auth/login" className="hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
