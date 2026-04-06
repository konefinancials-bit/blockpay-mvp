'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Nfc } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-bp-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="size-8 rounded-lg bg-purple-gradient flex items-center justify-center">
            <Nfc className="size-4 text-white" />
          </div>
          <span className="font-bold text-lg">BlockPay</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-2">Sign in</h1>
          <p className="text-bp-text-sec text-sm mb-6">Access your merchant dashboard</p>

          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-bp-text-sec mb-1.5 font-medium">Email</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bp-bg border border-bp-border text-white placeholder-bp-text-dim focus:outline-none focus:border-bp-purple text-sm" />
            </div>
            <div>
              <label className="block text-sm text-bp-text-sec mb-1.5 font-medium">Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bp-bg border border-bp-border text-white placeholder-bp-text-dim focus:outline-none focus:border-bp-purple text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-bp-border" />
            <span className="text-xs text-bp-text-dim">or</span>
            <div className="flex-1 h-px bg-bp-border" />
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full py-3 rounded-xl border border-bp-border hover:border-bp-purple/30 text-sm font-medium text-bp-text-sec hover:text-white transition-all disabled:opacity-50">
            Continue with Google
          </button>
        </div>

        <p className="text-center text-bp-text-dim text-sm mt-4">
          No account? <Link href="/auth/signup" className="text-bp-purple hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
