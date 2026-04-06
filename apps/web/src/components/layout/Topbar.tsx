'use client';

import { Bell } from 'lucide-react';
import { useMerchantStore } from '@/stores/merchant-store';

export function Topbar({ title }: { title: string }) {
  const { merchant } = useMerchantStore();
  return (
    <header className="h-14 border-b border-bp-border bg-bp-bg/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="size-9 rounded-xl border border-bp-border hover:border-bp-purple/30 flex items-center justify-center text-bp-text-sec hover:text-white transition-all">
          <Bell className="size-4" />
        </button>
        <div className="size-9 rounded-full bg-bp-purple/20 border border-bp-purple/30 flex items-center justify-center text-sm font-bold text-bp-purple">
          {merchant?.displayName?.[0]?.toUpperCase() ?? 'M'}
        </div>
      </div>
    </header>
  );
}
