'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/* ── Live FX ticker ── */
const COINS = [
  { id: 'btc', sym: 'BTC', name: 'Bitcoin', network: 'Native', cls: 'b', glyph: '₿', base: 65420 },
  { id: 'eth', sym: 'ETH', name: 'Ethereum', network: 'ERC-20', cls: 'e', glyph: 'Ξ', base: 3180 },
  { id: 'usdc', sym: 'USDC', name: 'USD Coin', network: 'Stablecoin', cls: 'u', glyph: '$', base: 1 },
  { id: 'sol', sym: 'SOL', name: 'Solana', network: 'Native', cls: 's', glyph: '◎', base: 155 },
];

const coinColors: Record<string, string> = { b: '#f7931a', e: '#627eea', u: '#2775ca', s: '#9945ff' };
const coinBg: Record<string, string> = { b: 'rgba(247,147,26,.12)', e: 'rgba(98,126,234,.12)', u: 'rgba(39,117,202,.12)', s: 'rgba(153,69,255,.12)' };

function useTicker(base: number) {
  const [p, setP] = useState(base);
  useEffect(() => {
    if (base === 1) return;
    const t = setInterval(() => setP((v) => parseFloat((v * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2))), 3000);
    return () => clearInterval(t);
  }, [base]);
  return p;
}

function FxRow({ coin, amount, selected, onSelect }: { coin: typeof COINS[0]; amount: number; selected: boolean; onSelect: () => void }) {
  const price = useTicker(coin.base);
  const crypto = price > 0 ? (amount / price).toFixed(price < 2 ? 2 : 6).replace(/\.?0+$/, '') : '—';
  return (
    <div onClick={onSelect} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: selected ? 'rgba(200,241,53,.07)' : 'rgba(244,242,237,.03)',
      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12, padding: '13px 16px', cursor: 'pointer',
      transition: 'border-color .2s, background .2s, transform .15s',
      marginBottom: 9,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: coinBg[coin.cls], color: coinColors[coin.cls], fontFamily: 'var(--font-syne, serif)', flexShrink: 0 }}>{coin.glyph}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{coin.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{coin.sym} · {coin.network}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-syne, serif)', fontSize: 14, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--accent)' }}>{crypto}</div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('eth');
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    let ringX = 0, ringY = 0;
    const onMove = (e: MouseEvent) => {
      if (curRef.current) { curRef.current.style.left = e.clientX + 'px'; curRef.current.style.top = e.clientY + 'px'; }
      ringX += (e.clientX - ringX) * 0.18;
      ringY += (e.clientY - ringY) * 0.18;
      if (ringRef.current) { ringRef.current.style.left = e.clientX + 'px'; ringRef.current.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('vis'); }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); }
  };

  const S = { // style helpers
    syne: { fontFamily: 'var(--font-syne, Syne, sans-serif)' } as React.CSSProperties,
    eyebrow: { fontSize: 11, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 },
  };

  return (
    <div style={{ background: 'var(--black)', color: 'var(--white)' }}>
      {/* Custom cursor */}
      <div id="bp-cursor" ref={curRef} />
      <div id="bp-cursor-ring" ref={ringRef} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 52px',
        background: scrolled ? 'rgba(8,8,8,.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        transition: 'background .35s, border-color .35s, backdrop-filter .35s',
      }}>
        <div style={{ ...S.syne, fontWeight: 800, fontSize: 20, letterSpacing: '-.4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="logo-dot" />BlockPay
        </div>
        <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none' }}>
          {[['#how', 'How it works'], ['#devices', 'Hardware'], ['#fx', 'FX Engine'], ['#pricing', 'Pricing'], ['#founder', 'About']].map(([href, label]) => (
            <li key={href} className="hidden md:block">
              <a href={href} style={{ color: 'var(--dim)', textDecoration: 'none', fontSize: 14, letterSpacing: '.01em', transition: 'color .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}>{label}</a>
            </li>
          ))}
        </ul>
        <Link href="/auth/signup" style={{
          background: 'var(--accent)', color: 'var(--black)', border: 'none', padding: '10px 22px',
          borderRadius: 100, fontSize: 14, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
          transition: 'transform .14s, box-shadow .18s', display: 'inline-block',
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(200,241,53,.35)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
          Join waitlist
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '140px 52px 100px', position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(244,242,237,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,242,237,.03) 1px,transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 90% 80% at 40% 50%,black 30%,transparent 100%)' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', width: 560, height: 560, background: 'radial-gradient(circle,rgba(200,241,53,.08) 0%,transparent 65%)', top: '45%', left: '30%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', animation: 'glowDrift 9s ease-in-out infinite alternate' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div className="anim-fade-up" style={{ animationDelay: '.1s', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,241,53,.07)', border: '1px solid rgba(200,241,53,.2)', borderRadius: 100, padding: '5px 14px 5px 8px', fontSize: 12, fontWeight: 500, letterSpacing: '.04em', color: 'var(--accent)', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', animation: 'blink 2s infinite', display: 'inline-block' }} />
            Pre-launch &nbsp;·&nbsp; Seed round open &nbsp;·&nbsp; Q3 2026
          </div>

          <h1 className="anim-fade-up" style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(48px, 5.5vw, 80px)', lineHeight: .97, letterSpacing: '-.035em', marginBottom: 28, animationDelay: '.25s' }}>
            <span style={{ display: 'block' }}>Tap. Pay.</span>
            <span style={{ display: 'block', color: 'var(--accent)' }}>Any crypto.</span>
            <span style={{ display: 'block', WebkitTextStroke: '1.5px var(--white)', color: 'transparent' }}>Any business.</span>
          </h1>

          <p className="anim-fade-up" style={{ fontSize: 17, fontWeight: 300, color: 'var(--dim)', maxWidth: 440, lineHeight: 1.75, marginBottom: 44, animationDelay: '.4s' }}>
            BlockPay turns a physical NFC device into a crypto payment terminal. Customers tap their phone — a live payment page opens, they pick their coin, done. No app. No QR code. No card reader.{' '}
            <strong style={{ color: 'var(--white)', fontWeight: 500 }}>580M+ crypto holders. Zero frictionless way to spend at the register.</strong> Until now.
          </p>

          {/* Waitlist form */}
          <form onSubmit={handleWaitlist} className="anim-fade-up" style={{ display: 'flex', gap: 10, maxWidth: 420, animationDelay: '.55s' }}>
            {!submitted ? (
              <>
                <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: 'var(--mid2)', border: '1px solid var(--border2)', borderRadius: 100, padding: '14px 22px', fontFamily: 'var(--font-dm, inherit)', fontSize: 15, color: 'var(--white)', outline: 'none', transition: 'border-color .2s' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,241,53,.4)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
                <button type="submit" style={{ background: 'var(--accent)', color: 'var(--black)', border: 'none', padding: '14px 26px', borderRadius: 100, fontFamily: 'var(--font-dm, inherit)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'box-shadow .2s, transform .14s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(200,241,53,.38)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.transform = ''; }}>
                  Get early access
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderRadius: 100, background: 'rgba(200,241,53,.07)', border: '1px solid rgba(200,241,53,.25)', color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                ✓ You&apos;re on the list — we&apos;ll be in touch!
              </div>
            )}
          </form>

          {/* Investor CTA */}
          <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, animationDelay: '.72s' }}>
            <a href="mailto:keilan@blockpay.live?subject=BlockPay%20Investor%20Inquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', textDecoration: 'none', fontSize: 14, fontWeight: 500, border: '1px solid rgba(200,241,53,.3)', borderRadius: 100, padding: '8px 18px', transition: 'background .2s, box-shadow .2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,241,53,.08)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(200,241,53,.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
              📄 Request pitch deck &nbsp;→
            </a>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300 }}>Raising a $15M seed round</span>
          </div>

          <p className="anim-fade-up" style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)', fontWeight: 300, animationDelay: '.68s' }}>
            <span style={{ width: 5, height: 5, background: '#3dffa0', borderRadius: '50%', display: 'inline-block', marginRight: 4 }} />
            Launching Q3 2026 &nbsp;·&nbsp; Be first to know
          </p>
        </div>

        {/* Hero device illustration */}
        <div className="anim-fade-in hidden md:flex" style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, animationDelay: '.6s' }}>
          <div style={{ position: 'relative', width: 360, height: 460 }}>
            <svg width="360" height="460" viewBox="0 0 360 460" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="hPuckFace" cx="38%" cy="33%" r="68%"><stop offset="0%" stopColor="#2e2e2e"/><stop offset="100%" stopColor="#0e0e0e"/></radialGradient>
                <linearGradient id="hPuckRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e1e1e"/><stop offset="100%" stopColor="#070707"/></linearGradient>
                <linearGradient id="hPhoneBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1c1c1c"/><stop offset="50%" stopColor="#202020"/><stop offset="100%" stopColor="#111"/></linearGradient>
                <linearGradient id="hScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#151515"/><stop offset="100%" stopColor="#090909"/></linearGradient>
                <radialGradient id="hAmbient" cx="52%" cy="62%" r="46%"><stop offset="0%" stopColor="#c8f135" stopOpacity="0.08"/><stop offset="100%" stopColor="#c8f135" stopOpacity="0"/></radialGradient>
                <filter id="hLedGlow" x="-250%" y="-250%" width="600%" height="600%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="hPhoneShadow" x="-18%" y="-10%" width="136%" height="128%"><feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="rgba(0,0,0,0.75)"/></filter>
                <filter id="hPuckShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="22" floodColor="rgba(0,0,0,0.7)"/></filter>
              </defs>
              <ellipse cx="188" cy="375" rx="165" ry="78" fill="url(#hAmbient)"/>
              <ellipse cx="185" cy="360" rx="82" ry="24" stroke="rgba(200,241,53,0.22)" strokeWidth="1" fill="none" style={{ animation: 'hPuckPulse 3s 0s ease-out infinite', transformOrigin: '185px 360px' }}/>
              <ellipse cx="185" cy="360" rx="110" ry="32" stroke="rgba(200,241,53,0.14)" strokeWidth="1" fill="none" style={{ animation: 'hPuckPulse 3s 1s ease-out infinite', transformOrigin: '185px 360px' }}/>
              <ellipse cx="185" cy="360" rx="140" ry="41" stroke="rgba(200,241,53,0.07)" strokeWidth="1" fill="none" style={{ animation: 'hPuckPulse 3s 2s ease-out infinite', transformOrigin: '185px 360px' }}/>
              <g transform="rotate(-4, 148, 152)" filter="url(#hPhoneShadow)">
                <rect x="88" y="36" width="118" height="230" rx="20" fill="url(#hPhoneBody)" stroke="rgba(244,242,237,0.12)" strokeWidth="1"/>
                <rect x="98" y="56" width="101" height="196" rx="13" fill="url(#hScreen)"/>
                <rect x="128" y="60" width="40" height="9" rx="4.5" fill="rgba(244,242,237,0.05)"/>
                <text x="148" y="92" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fontWeight="500" fill="rgba(244,242,237,0.3)" letterSpacing="1.5">PAY NOW</text>
                <text x="148" y="117" textAnchor="middle" fontFamily="Syne,sans-serif" fontSize="23" fontWeight="800" fill="#f4f2ed" letterSpacing="-1">$34.00</text>
                <text x="148" y="129" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="6.5" fontWeight="300" fill="rgba(244,242,237,0.22)">BlockPay · Houston TX</text>
                <line x1="102" y1="136" x2="194" y2="136" stroke="rgba(244,242,237,0.07)" strokeWidth="0.8"/>
                <rect x="102" y="141" width="92" height="22" rx="6" fill="rgba(244,242,237,0.03)"/>
                <circle cx="116" cy="152" r="7.5" fill="rgba(247,147,26,0.15)"/>
                <text x="116" y="155.5" textAnchor="middle" fontFamily="serif" fontSize="9.5" fontWeight="700" fill="#f7931a">₿</text>
                <text x="129" y="155" fontFamily="DM Sans,sans-serif" fontSize="7.5" fontWeight="500" fill="rgba(244,242,237,0.5)">BTC</text>
                <text x="191" y="155" textAnchor="end" fontFamily="Syne,sans-serif" fontSize="7" fontWeight="600" fill="rgba(200,241,53,0.6)">0.00052</text>
                <rect x="102" y="167" width="92" height="22" rx="6" fill="rgba(200,241,53,0.07)" stroke="rgba(200,241,53,0.32)" strokeWidth="0.8"/>
                <circle cx="116" cy="178" r="7.5" fill="rgba(98,126,234,0.16)"/>
                <text x="116" y="182" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="700" fill="#627eea">Ξ</text>
                <text x="129" y="181" fontFamily="DM Sans,sans-serif" fontSize="7.5" fontWeight="500" fill="#f4f2ed">ETH</text>
                <text x="191" y="181" textAnchor="end" fontFamily="Syne,sans-serif" fontSize="7" fontWeight="600" fill="rgba(200,241,53,0.95)">0.0110</text>
                <rect x="102" y="193" width="92" height="22" rx="6" fill="rgba(244,242,237,0.03)"/>
                <circle cx="116" cy="204" r="7.5" fill="rgba(39,117,202,0.15)"/>
                <text x="116" y="208" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="700" fill="#2775ca">$</text>
                <text x="129" y="207" fontFamily="DM Sans,sans-serif" fontSize="7.5" fontWeight="500" fill="rgba(244,242,237,0.5)">USDC</text>
                <text x="191" y="207" textAnchor="end" fontFamily="Syne,sans-serif" fontSize="7" fontWeight="600" fill="rgba(200,241,53,0.6)">34.01</text>
                <rect x="102" y="220" width="92" height="21" rx="7" fill="rgba(200,241,53,0.9)"/>
                <text x="148" y="233.5" textAnchor="middle" fontFamily="Syne,sans-serif" fontSize="7.5" fontWeight="800" fill="#080808" letterSpacing="0.8">PAY WITH ETH</text>
              </g>
              <line x1="155" y1="272" x2="174" y2="328" stroke="rgba(200,241,53,0.18)" strokeWidth="1.2" strokeDasharray="4 5"/>
              <circle cx="174" cy="329" r="2.5" fill="rgba(200,241,53,0.4)"/>
              <ellipse cx="185" cy="412" rx="114" ry="13" fill="rgba(0,0,0,0.55)"/>
              <path d="M 70,360 A 115,33 0 0 1 300,360 L 300,383 L 70,383 Z" fill="url(#hPuckRim)" stroke="rgba(244,242,237,0.04)" strokeWidth="0.8"/>
              <ellipse cx="185" cy="360" rx="115" ry="33" fill="url(#hPuckFace)" stroke="rgba(244,242,237,0.13)" strokeWidth="1" filter="url(#hPuckShadow)"/>
              <ellipse cx="185" cy="360" rx="13" ry="3.9" stroke="rgba(200,241,53,0.58)" strokeWidth="1.3" fill="none"/>
              <ellipse cx="185" cy="360" rx="24" ry="7.2" stroke="rgba(200,241,53,0.37)" strokeWidth="1.1" fill="none"/>
              <ellipse cx="185" cy="360" rx="38" ry="11.4" stroke="rgba(200,241,53,0.22)" strokeWidth="1" fill="none"/>
              <ellipse cx="185" cy="360" rx="55" ry="16.5" stroke="rgba(200,241,53,0.11)" strokeWidth="1" fill="none"/>
              <ellipse cx="185" cy="360" rx="5" ry="1.6" fill="#c8f135" opacity="0.92"/>
              <ellipse cx="185" cy="360" rx="9.5" ry="3" fill="rgba(200,241,53,0.18)"/>
              <circle cx="258" cy="352" r="4" fill="#c8f135" opacity="0.88" filter="url(#hLedGlow)" style={{ animation: 'blink 2.1s ease-in-out infinite' }}/>
              <circle cx="258" cy="352" r="7.5" fill="rgba(200,241,53,0.14)"/>
              <text x="185" y="344" textAnchor="middle" fontFamily="Syne,sans-serif" fontSize="10" fontWeight="700" fill="rgba(244,242,237,0.38)" letterSpacing="3.8">BLOCKPAY</text>
            </svg>

            {/* Floating popup */}
            <div style={{ position: 'absolute', right: -22, top: 158, width: 162, background: 'var(--mid2)', border: '1px solid var(--border2)', borderRadius: 18, padding: 15, boxShadow: '0 20px 50px rgba(0,0,0,.65)', animation: 'popFloat 3.8s ease-in-out infinite alternate', zIndex: 2 }}>
              <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Pay now</div>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', marginBottom: 12 }}>$34.00</div>
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 10 }} />
              {[{ sym: 'BTC', g: '₿', cls: 'b', val: '0.00052' }, { sym: 'ETH', g: 'Ξ', cls: 'e', val: '0.0110' }, { sym: 'USDC', g: '$', cls: 'u', val: '34.01' }].map((c, i) => (
                <div key={c.sym} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', borderRadius: 9, marginBottom: 5, border: `1px solid ${i === 1 ? 'rgba(200,241,53,.45)' : 'transparent'}`, background: i === 1 ? 'rgba(200,241,53,.06)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: coinBg[c.cls], color: coinColors[c.cls] }}>{c.g}</div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--dim)' }}>{c.sym}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500, fontFamily: 'var(--font-syne)' }}>{c.val}</span>
                </div>
              ))}
              <button style={{ width: '100%', background: 'var(--accent)', color: 'var(--black)', border: 'none', borderRadius: 9, padding: 8, fontFamily: 'var(--font-syne)', fontSize: 11, fontWeight: 800, marginTop: 8, letterSpacing: '.04em', cursor: 'pointer' }}>PAY WITH ETH</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, background: 'var(--mid)', flexWrap: 'wrap' }}>
        {[
          { icon: '🔒', text: <><strong style={{ color: 'var(--white)', fontWeight: 500 }}>Non-custodial</strong> — merchants keep their keys</> },
          { icon: '⚡', text: <><strong style={{ color: 'var(--white)', fontWeight: 500 }}>No app required</strong> for customers</> },
          { icon: '🌐', text: <><strong style={{ color: 'var(--white)', fontWeight: 500 }}>50+ coins</strong> with live FX conversion</> },
          { icon: '📈', text: <><strong style={{ color: 'var(--white)', fontWeight: 500 }}>$28T POS market</strong> — crypto&apos;s share: &lt;0.1%</> },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, opacity: .7 }}>{p.icon}</span>
            <span style={{ fontSize: 14, color: 'var(--dim)', fontWeight: 300 }}>{p.text}</span>
          </div>
        ))}
      </div>

      {/* ── PROBLEM ── */}
      <section style={{ padding: '120px 52px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 88, alignItems: 'center' }}>
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />The Problem</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 18 }}>Accepting crypto in person is still a mess.</h2>
          <p style={{ fontSize: 16, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.75 }}>Every existing solution makes the merchant do too much work, or makes the customer jump through too many hoops. That friction is exactly why $28T in annual POS volume still doesn&apos;t include crypto.</p>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }} className="reveal">
          {[
            { title: 'QR codes are clunky', desc: 'Customers open a wallet, scan, type amounts — checkout takes 90 seconds. Nobody has time for that.' },
            { title: 'Custodial gateways are a liability', desc: "BitPay and Coinbase Commerce hold your funds. You're trusting a third party with your revenue." },
            { title: 'No multi-coin support at POS', desc: 'Most tools support 1–3 coins. Your customer wants to pay in SOL, you only accept BTC. Sale lost.' },
          ].map((p) => (
            <li key={p.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '22px 24px', background: 'var(--mid)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(255,100,100,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: '#ff6464' }}>✕</div>
              <div>
                <div style={{ ...S.syne, fontSize: 15, fontWeight: 600, marginBottom: 4, letterSpacing: '-.01em' }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── MARKET STATS ── */}
      <section style={{ padding: '120px 52px', background: 'var(--mid)' }} id="market">
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />The Opportunity</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 56 }}>A trillion-dollar gap.<br />Zero infrastructure to fill it.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--border)' }} className="reveal">
          {[
            { num: '580M+', label: 'Global crypto holders', note: 'People who own crypto with no frictionless way to spend it in person today.' },
            { num: '$28T', label: 'Annual POS volume', note: "Global in-store payment volume annually. Crypto's share: under 0.1%. The floor is massive." },
            { num: '567%', label: 'Crypto payment growth', note: 'Growth in on-chain payment volume between 2020 and 2024. Demand is already here.' },
          ].map((s) => (
            <div key={s.num} style={{ background: 'var(--black)', padding: '44px 40px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 1, background: 'var(--accent)', display: 'block' }} />{s.label}
              </div>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(44px,4.5vw,64px)', letterSpacing: '-.04em', color: 'var(--accent)', lineHeight: 1, marginBottom: 10 }}>{s.num}</div>
              <div style={{ fontSize: 14, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.7, maxWidth: 220 }}>{s.note}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, padding: '28px 36px', background: 'rgba(200,241,53,.04)', border: '1px solid rgba(200,241,53,.14)', borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 18 }} className="reveal">
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>🎯</span>
          <p style={{ fontSize: 15, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--white)', fontWeight: 500 }}>BlockPay&apos;s thesis:</strong> The bottleneck to crypto at the register isn&apos;t consumer demand — it&apos;s the absence of dead-simple merchant infrastructure. A single tap-to-pay device that requires zero customer setup is that infrastructure. We&apos;re not betting on crypto adoption. We&apos;re capitalizing on adoption that&apos;s already happened.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '120px 52px' }}>
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />How it works</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 64 }}>From setup to first payment<br />in under 10 minutes.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, background: 'var(--border)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }} className="reveal">
          {[
            { n: '1', emoji: '📦', title: 'Order a device', desc: 'Choose a counter puck, NFC card, or table sticker. Ships pre-programmed to your account.' },
            { n: '2', emoji: '🖥', title: 'Set your price', desc: 'Enter the amount on your merchant dashboard. The device updates instantly.' },
            { n: '3', emoji: '📱', title: 'Customer taps', desc: 'Their phone opens your payment page. They see live rates for every supported coin.' },
            { n: '4', emoji: '✓', title: 'You get paid', desc: 'On-chain confirmation in seconds. Settle in crypto or auto-convert to USDC daily.' },
          ].map((s) => (
            <div key={s.n} style={{ background: 'var(--black)', padding: '44px 36px', position: 'relative' }}>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 72, lineHeight: 1, letterSpacing: '-.05em', color: 'rgba(244,242,237,.05)', position: 'absolute', top: 18, right: 20 }}>{s.n}</div>
              <div style={{ width: 46, height: 46, background: 'rgba(200,241,53,.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 22 }}>{s.emoji}</div>
              <div style={{ ...S.syne, fontWeight: 700, fontSize: 18, letterSpacing: '-.02em', marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HARDWARE ── */}
      <section id="devices" style={{ padding: '120px 52px', background: 'var(--mid)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 64 }} className="reveal">
          <div>
            <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />The Hardware</div>
            <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05 }}>One tap.<br />Three form factors.</h2>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300, maxWidth: 240, textAlign: 'right', lineHeight: 1.7 }}>All devices ship pre-programmed. No technical setup required.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="reveal">
          {[
            { name: 'Counter Puck', tag: 'Best seller', emoji: '🔵', desc: 'Sits on your counter. Customer taps their phone on the top. Payment page opens instantly.', specs: ['88mm', 'NFC ISO 14443', 'Matte black'], price: 'From $59', primary: true },
            { name: 'NFC Card', tag: '', emoji: '💳', desc: 'Standard credit card size. Hand it to a customer or mount it in a cardholder.', specs: ['CR80', 'Metal option', 'Custom print'], price: 'From $18', primary: false },
            { name: 'Table Sticker', tag: '', emoji: '⭕', desc: 'Weatherproof adhesive disc. Stick it to a table, a menu, or a receipt tray.', specs: ['60mm', 'Waterproof', 'Bulk pricing'], price: 'From $8', primary: false },
          ].map((d) => (
            <div key={d.name} style={{ background: 'var(--mid2)', border: `1px solid ${d.primary ? 'rgba(200,241,53,.18)' : 'var(--border)'}`, borderRadius: 22, padding: '48px 32px 38px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              {d.tag && <span style={{ position: 'absolute', top: 18, right: 18, background: 'var(--accent)', color: 'var(--black)', fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 }}>{d.tag}</span>}
              {d.primary && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,var(--accent),transparent)' }} />}
              <div style={{ fontSize: 48, marginBottom: 28 }}>{d.emoji}</div>
              <div style={{ ...S.syne, fontWeight: 700, fontSize: 19, letterSpacing: '-.02em', marginBottom: 8, textAlign: 'center' }}>{d.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.68, fontWeight: 300, marginBottom: 22 }}>{d.desc}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
                {d.specs.map((s) => <span key={s} style={{ background: 'rgba(244,242,237,.045)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 11px', fontSize: 11, color: 'var(--muted)' }}>{s}</span>)}
              </div>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>{d.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE FX ── */}
      <section id="fx" style={{ padding: '120px 52px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 88, alignItems: 'center' }}>
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />Live FX Engine</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 18 }}>Customers pay in their coin.<br />You get the dollar amount.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 32 }}>
            {['Rates sourced from live oracle feeds, updated every 5 seconds', 'Optional volatility protection — lock the USD price at checkout', 'Every transaction logged with the FX rate at time of payment', 'Merchant can hold crypto or auto-settle to USDC daily'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, fontSize: 15, color: 'var(--dim)' }}>
                <div style={{ width: 20, height: 20, background: 'rgba(200,241,53,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="reveal" style={{ position: 'relative' }}>
          <div style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 22, padding: 36, position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, position: 'absolute', top: -12, right: 22, background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 13px', fontSize: 10.5, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: '#3dffa0' }}>
              <span style={{ width: 5, height: 5, background: '#3dffa0', borderRadius: '50%', animation: 'blink 1.6s infinite', display: 'inline-block' }} />Live rates
            </div>
            <div style={{ textAlign: 'center', paddingBottom: 28, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Amount due</div>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 48, letterSpacing: '-.04em' }}>$49.00</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>BlockPay demo · Houston TX</div>
            </div>
            {COINS.map((c) => (
              <FxRow key={c.id} coin={c} amount={49} selected={selectedCoin === c.id} onSelect={() => setSelectedCoin(c.id)} />
            ))}
            <button style={{ width: '100%', background: 'var(--accent)', color: 'var(--black)', border: 'none', borderRadius: 11, padding: 15, fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 14, transition: 'box-shadow .2s, transform .13s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(200,241,53,.38)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.transform = ''; }}>
              Pay with {COINS.find((c) => c.id === selectedCoin)?.sym}
            </button>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: '120px 52px', background: 'var(--mid)' }}>
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />Why BlockPay</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 56 }}>We built what nobody else has.</h2>
        </div>
        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ fontFamily: 'var(--font-syne)', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', padding: '14px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Feature</th>
                {['BlockPay', 'BitPay', 'Coinbase Commerce', 'NOWPayments'].map((n, i) => (
                  <th key={n} style={{ fontFamily: 'var(--font-syne)', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: i === 0 ? 'var(--accent)' : 'var(--muted)', padding: '14px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{n}</th>
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
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(200,241,53,.04)' : 'transparent' }}>
                  <td style={{ padding: '15px 20px', fontSize: 14, borderBottom: '1px solid rgba(244,242,237,.04)', color: i % 2 === 0 ? 'var(--accent)' : 'var(--dim)' }}>{row[0] as string}</td>
                  {[row[1], row[2], row[3], row[4]].map((v, j) => (
                    <td key={j} style={{ padding: '15px 20px', fontSize: 16, borderBottom: '1px solid rgba(244,242,237,.04)' }}>
                      {v === true ? <span style={{ color: 'var(--accent)' }}>✓</span> : v === false ? <span style={{ color: 'rgba(244,242,237,.17)' }}>✗</span> : <span style={{ fontSize: 12, color: 'var(--muted)' }}>Partial</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '120px 52px' }}>
        <div className="reveal">
          <div style={S.eyebrow}><span style={{ width: 16, height: 1, background: 'var(--accent)', display: 'block' }} />Pricing</div>
          <h2 style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(34px,3.8vw,52px)', letterSpacing: '-.032em', lineHeight: 1.05, marginBottom: 18 }}>Straightforward plans.<br />No surprises.</h2>
          <p style={{ fontSize: 16, color: 'var(--dim)', fontWeight: 300, marginBottom: 64 }}>Join the waitlist to lock in early-adopter rates.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="reveal">
          {[
            { name: 'Starter', price: '$29', mo: '/mo', desc: 'For small businesses accepting crypto for the first time.', features: ['1 NFC device included', 'Up to 500 transactions/mo', 'Live FX on 20+ coins', 'Merchant dashboard', '0.8% transaction fee'], cta: 'Start free trial', plan: 'starter', feat: false },
            { name: 'Business', price: '$99', mo: '/mo', desc: 'For growing businesses that need multiple devices and full analytics.', features: ['5 NFC devices included', 'Unlimited transactions', 'Live FX on 50+ coins', 'Full analytics & FX history', '0.5% transaction fee', 'Auto USDC settlement'], cta: 'Start free trial', plan: 'business', feat: true },
            { name: 'White-label', price: '$499', mo: '/mo', desc: 'Full platform under your own brand, with custom devices and payment pages.', features: ['Custom branded devices', 'White-label payment page', 'API access', 'Custom coin selection', '0.3% transaction fee', 'Dedicated support'], cta: 'Contact sales', plan: 'whitelabel', feat: false },
          ].map((p) => (
            <div key={p.name} style={{ background: p.feat ? 'rgba(200,241,53,.035)' : 'var(--mid2)', border: `1px solid ${p.feat ? 'rgba(200,241,53,.3)' : 'var(--border)'}`, borderRadius: 22, padding: '40px 34px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.feat ? 'linear-gradient(90deg,var(--accent),transparent 65%)' : 'transparent' }} />
              {p.feat && <div style={{ background: 'var(--accent)', color: 'var(--black)', fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 11px', borderRadius: 100, display: 'inline-block', marginBottom: 20 }}>Most popular</div>}
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 24, letterSpacing: '-.025em', marginBottom: 8 }}>{p.name}</div>
              <div style={{ ...S.syne, fontSize: 42, fontWeight: 800, letterSpacing: '-.04em', marginBottom: 4 }}>
                {p.price}<sub style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)', verticalAlign: 'baseline' }}>{p.mo}</sub>
              </div>
              <p style={{ fontSize: 14, color: 'var(--dim)', fontWeight: 300, lineHeight: 1.65, margin: '16px 0 26px' }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30, flex: 1 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ fontSize: 14, color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 15, height: 15, borderRadius: '50%', background: 'rgba(200,241,53,.12)', border: '1px solid rgba(200,241,53,.35)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="7" height="6" viewBox="0 0 7 6" fill="none"><path d="M1 3L2.8 5L6 1" stroke="#c8f135" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/auth/signup?plan=${p.plan}`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: 13, borderRadius: 11, fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'border-color .2s, background .2s, color .2s, box-shadow .2s', background: p.feat ? 'var(--accent)' : 'transparent', color: p.feat ? 'var(--black)' : 'var(--white)', border: p.feat ? '1px solid var(--accent)' : '1px solid var(--border2)' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>Hardware sold separately. All plans include free onboarding. Cancel any time.</p>
      </section>

      {/* ── FOUNDER ── */}
      <section id="founder" style={{ padding: '120px 52px', background: 'var(--mid)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 88, alignItems: 'center' }}>
        <div className="reveal" style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 24, padding: 48, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--accent),transparent 60%)' }} />
          <div style={{ width: 68, height: 68, background: 'rgba(200,241,53,.09)', border: '1.5px solid rgba(200,241,53,.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginBottom: 22 }}>KR</div>
          <div style={{ ...S.syne, fontWeight: 800, fontSize: 26, letterSpacing: '-.028em', marginBottom: 5 }}>Keilan Robinson</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Founder & CEO</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
            {['Age 22', 'Tucker, GA', 'Self-employed since 18'].map((t) => (
              <span key={t} style={{ background: 'rgba(244,242,237,.05)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 13px', fontSize: 12, color: 'var(--dim)' }}>{t}</span>
            ))}
          </div>
          <blockquote style={{ fontSize: 15, fontWeight: 300, color: 'var(--dim)', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '2px solid var(--accent)', paddingLeft: 20, marginBottom: 28 }}>
            &ldquo;I noticed how technology is advancing every industry, and I wanted to create something that has real value and will greatly impact the crypto market. The gap between crypto&apos;s potential and everyday merchant adoption is still massive — BlockPay is how we close it.&rdquo;
          </blockquote>
          <div style={{ fontSize: 14, color: 'var(--dim)' }}>Investor inquiries: <a href="mailto:keilan@blockpay.live" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid rgba(200,241,53,.28)' }}>keilan@blockpay.live</a></div>
        </div>
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Seed round target', val: '$15M', note: 'Engineering 40% · Marketing 25% · Compliance 20% · Ops 15%' },
            { label: 'Target launch', val: 'Q3 2026', note: 'Merchant beta starting Q2 2026 — apply via waitlist' },
            { label: 'Revenue projection (ARR)', val: '$5.2M', note: 'Y1: $480K → Y2: $1.8M → Y3: $5.2M' },
          ].map((v) => (
            <div key={v.label} style={{ padding: '24px 26px', background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{v.label}</div>
              <div style={{ ...S.syne, fontWeight: 800, fontSize: 28, letterSpacing: '-.035em', color: 'var(--accent)', marginBottom: 4 }}>{v.val}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>{v.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '140px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 440, background: 'radial-gradient(ellipse,rgba(200,241,53,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <h2 className="reveal" style={{ ...S.syne, fontWeight: 800, fontSize: 'clamp(40px,5vw,68px)', letterSpacing: '-.035em', lineHeight: 1.04, marginBottom: 22 }}>Be early. In whatever<br />way fits you.</h2>
        <p className="reveal" style={{ fontSize: 17, color: 'var(--dim)', fontWeight: 300, marginBottom: 44 }}>Whether you&apos;re a merchant ready to accept crypto, or an investor who sees where payments are going — there&apos;s a seat at the table.</p>
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: 10, maxWidth: 400 }}>
            {!submitted ? (
              <>
                <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: 'var(--mid2)', border: '1px solid var(--border2)', borderRadius: 100, padding: '14px 22px', fontFamily: 'var(--font-dm)', fontSize: 15, color: 'var(--white)', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,241,53,.4)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
                <button type="submit" style={{ background: 'var(--accent)', color: 'var(--black)', border: 'none', padding: '14px 26px', borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Join waitlist
                </button>
              </>
            ) : (
              <div style={{ padding: '14px 22px', borderRadius: 100, background: 'rgba(200,241,53,.07)', border: '1px solid rgba(200,241,53,.25)', color: 'var(--accent)', fontSize: 14 }}>✓ You&apos;re on the list!</div>
            )}
          </form>
          <a href="mailto:keilan@blockpay.live?subject=BlockPay%20Investor%20Inquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--white)', border: '1px solid var(--border2)', padding: '14px 28px', borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer', textDecoration: 'none', transition: 'border-color .2s' }}>
            📈 Request pitch deck
          </a>
        </div>
        <p className="reveal" style={{ fontSize: 13, color: 'var(--muted)' }}>No spam. No cold outreach. Just the things that matter.</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '44px 52px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...S.syne, fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="logo-dot" />BlockPay
        </div>
        <ul style={{ display: 'flex', gap: 30, listStyle: 'none' }}>
          {[['#how', 'How it works'], ['#devices', 'Hardware'], ['#pricing', 'Pricing'], ['/auth/login', 'Sign in']].map(([href, label]) => (
            <li key={href}><a href={href} style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)')} onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')}>{label}</a></li>
          ))}
        </ul>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>© 2026 BlockPay LLC, Tucker, Georgia</div>
      </footer>
    </div>
  );
}
