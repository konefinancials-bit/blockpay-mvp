'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, init } = useAuthStore();
  const { fetchMerchant, fetchPayments, fetchDevices } = useMerchantStore();
  const router = useRouter();

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/auth/login'); return; }
    fetchMerchant(user.uid);
    fetchPayments(user.uid);
    fetchDevices(user.uid);
  }, [user, initialized]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-bp-bg flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-bp-bg overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
