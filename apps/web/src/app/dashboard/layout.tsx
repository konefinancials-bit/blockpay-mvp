'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/payments', label: 'Payments' },
  { href: '/dashboard/devices', label: 'Devices' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/wallet', label: 'Wallet' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, init, signOut } = useAuthStore();
  const { fetchMerchant, fetchPayments, fetchDevices } = useMerchantStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/auth/login'); return; }
    fetchMerchant(user.uid);
    fetchPayments(user.uid);
    fetchDevices(user.uid);
  }, [user, initialized, router, fetchMerchant, fetchPayments, fetchDevices]);

  if (!initialized) return (
    <div className="app-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!user) return null;

  return (
    <div className="app-body">
      {/* Nav */}
      <nav className="app-nav">
        <Link href="/" className="app-nav-logo">BlockPay</Link>
        <ul className="app-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} style={{
                color: (href === '/dashboard' ? pathname === href : pathname?.startsWith(href)) ? 'var(--text)' : 'var(--muted)',
                textDecoration: 'none', fontSize: 13, fontWeight: (href === '/dashboard' ? pathname === href : pathname?.startsWith(href)) ? 500 : 400,
              }}>{label}</Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => signOut().then(() => router.push('/auth/login'))} className="btn-app-ghost">Sign out</button>
        </div>
      </nav>

      {children}

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
