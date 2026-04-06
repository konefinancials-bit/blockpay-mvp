'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Nfc, BarChart3, Settings, LogOut, ChevronRight, Wallet } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';
import clsx from 'clsx';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/devices', label: 'Devices', icon: Nfc },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/wallet', label: 'Wallet & Cards', icon: Wallet },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  business: 'bg-bp-purple/10 border-bp-purple/30 text-bp-purple',
  whitelabel: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const { merchant } = useMerchantStore();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-bp-surface border-r border-bp-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-bp-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-purple-gradient flex items-center justify-center">
            <Nfc className="size-4 text-white" />
          </div>
          <span className="font-bold text-lg">BlockPay</span>
        </Link>
      </div>

      {/* Merchant info */}
      {merchant && (
        <div className="px-4 py-3 border-b border-bp-border">
          <div className="text-sm font-semibold text-white truncate">{merchant.businessName}</div>
          <div className="text-xs text-bp-text-dim truncate">{merchant.email}</div>
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border mt-2 inline-block capitalize', PLAN_COLORS[merchant.plan])}>
            {merchant.plan}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href} href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active ? 'bg-bp-purple/15 text-white border border-bp-purple/20' : 'text-bp-text-sec hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={clsx('size-4', active ? 'text-bp-purple' : 'text-bp-text-dim group-hover:text-white')} />
              {label}
              {active && <ChevronRight className="size-3 ml-auto text-bp-purple" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-bp-border">
        <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-bp-text-sec hover:text-white hover:bg-white/5 w-full transition-all">
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
