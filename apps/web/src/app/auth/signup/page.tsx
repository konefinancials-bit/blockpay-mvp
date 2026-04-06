'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

function SignupForm() {
  const params = useSearchParams();
  const plan = params.get('plan') ?? 'starter';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { signUp, signInWithGoogle, loading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    try {
      await signUp(`${firstName} ${lastName}`.trim(), email, password, businessName);
      if (plan !== 'starter') {
        router.push(`/api/stripe/checkout?plan=${plan}`);
      } else {
        router.push('/dashboard');
      }
    } catch {}
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); router.push('/dashboard'); } catch {}
  };

  return (
    <div className="app-body">
      {/* Nav */}
      <nav className="app-nav">
        <Link href="/" className="app-nav-logo">BlockPay</Link>
        <ul className="app-nav-links">
          <li><Link href="/#how">How it works</Link></li>
          <li><Link href="/#devices">Hardware</Link></li>
          <li><Link href="/#pricing">Pricing</Link></li>
        </ul>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/auth/login" className="btn-app-ghost">Sign in</Link>
          <Link href="/auth/signup" className="btn-app-solid">Get started</Link>
        </div>
      </nav>

      <div className="page-body" style={{ maxWidth: 520 }}>
        <div className="page-label">Get started</div>
        <h1 className="page-title">Create your account</h1>
        <p className="page-sub">Start accepting crypto payments in minutes. No credit card required.</p>

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">First name</label>
              <input type="text" className="form-input" placeholder="Keilan" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input type="text" className="form-input" placeholder="Robinson" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Business email</label>
            <input type="email" className="form-input" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Business name</label>
            <input type="text" className="form-input" placeholder="Acme Store" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 8 characters" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', lineHeight: 1.5 }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ accentColor: 'var(--text)', marginTop: 3 }} />
              I agree to the{' '}
              <Link href="/terms" style={{ color: 'var(--text)', textDecoration: 'none' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: 'var(--text)', textDecoration: 'none' }}>Privacy Policy</Link>
            </label>
          </div>
          <button type="submit" className="btn-submit" disabled={loading || !agreed} style={{ width: '100%', opacity: (!agreed || loading) ? 0.5 : 1 }}>
            {loading ? 'Creating account…' : 'Create free account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--subtle)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', padding: '13px 24px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#CCCCC6'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}>
          Continue with Google
        </button>

        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

      <footer className="app-footer">
        <div className="app-footer-logo">BlockPay</div>
        <div className="app-footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <span className="app-footer-copy">© 2026 BlockPay Inc.</span>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="app-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
