'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { signIn, signInWithGoogle, loading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signIn(email, password); router.push('/dashboard'); } catch {}
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

      <div className="page-body" style={{ maxWidth: 480 }}>
        <div className="page-label">Account</div>
        <h1 className="page-title">Sign in</h1>
        <p className="page-sub">Welcome back. Enter your details to access your merchant dashboard.</p>

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: 'var(--text)' }} /> Remember me
            </label>
            <Link href="/auth/forgot" style={{ fontSize: 13, color: 'var(--green)', textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign in'}
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
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'none' }}>Get started free</Link>
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
