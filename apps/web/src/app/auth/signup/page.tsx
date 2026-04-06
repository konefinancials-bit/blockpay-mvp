'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nfc, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  starter: { name: 'Starter', price: '$29/mo' },
  business: { name: 'Business', price: '$99/mo' },
  whitelabel: { name: 'White-label', price: '$499/mo' },
};

function SignupForm() {
  const params = useSearchParams();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, signInWithGoogle, loading, error } = useAuthStore();
  const router = useRouter();

  const plan = params.get('plan') ?? 'starter';
  const planLabel = PLAN_LABELS[plan] ?? PLAN_LABELS.starter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(name, email, password, businessName);
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
    <div className="w-full max-w-sm">
      <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
        <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          <Nfc className="size-4 text-white" />
        </div>
        <span className="font-bold text-lg">BlockPay</span>
      </Link>

      <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Create account</h1>
          <span className="text-xs font-bold px-2 py-1 rounded-full capitalize"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
            {planLabel.name}
          </span>
        </div>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Start accepting crypto in minutes</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', color: '#ff6b6b' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Your name', placeholder: 'Keilan Robinson', value: name, set: setName, type: 'text' },
            { label: 'Business name', placeholder: 'Your Café', value: businessName, set: setBusinessName, type: 'text' },
            { label: 'Email', placeholder: 'you@example.com', value: email, set: setEmail, type: 'email' },
            { label: 'Password', placeholder: '••••••••', value: password, set: setPassword, type: 'password' },
          ].map(({ label, placeholder, value, set, type }) => (
            <div key={label}>
              <label className="block text-sm mb-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</label>
              <input type={type} required placeholder={placeholder} value={value} onChange={(e) => set(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
            {loading ? 'Creating account...' : plan !== 'starter' ? `Continue to payment (${planLabel.price})` : 'Create free account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
          Continue with Google
        </button>

        <div className="mt-5 space-y-1.5">
          {['Non-custodial payments', '14-day free trial', 'Cancel any time'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Check className="size-3 text-emerald-400" />{f}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: '#a78bfa' }} className="hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#060608' }}>
      <Suspense fallback={
        <div className="w-full max-w-sm flex items-center justify-center py-20">
          <div className="size-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
