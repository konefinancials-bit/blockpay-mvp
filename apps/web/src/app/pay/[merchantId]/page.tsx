import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PaymentClient } from './PaymentClient';
import { getAdminDb } from '@/lib/firebase-admin';

interface Props {
  params: { merchantId: string };
  searchParams: { amount?: string; device?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Pay with Crypto — BlockPay',
    description: 'Tap to pay with Bitcoin, Ethereum, Solana, and 50+ other cryptocurrencies.',
  };
}

export default async function PayPage({ params, searchParams }: Props) {
  const { merchantId } = params;
  const defaultAmount = searchParams.amount ? parseFloat(searchParams.amount) : undefined;

  try {
    const db = getAdminDb();
    const snap = await db.collection('merchants').doc(merchantId).get();

    if (!snap.exists) return notFound();

    const merchant = {
      businessName: snap.data()?.businessName ?? 'Merchant',
      displayName: snap.data()?.displayName ?? '',
      wallets: snap.data()?.wallets ?? {},
      plan: snap.data()?.plan ?? 'starter',
    };

    return <PaymentClient merchant={merchant} merchantId={merchantId} defaultAmount={defaultAmount} />;
  } catch {
    // Fallback for dev/missing Firebase admin config
    return (
      <PaymentClient
        merchant={{ businessName: 'Demo Merchant', displayName: 'Demo', wallets: {}, plan: 'starter' }}
        merchantId={merchantId}
        defaultAmount={defaultAmount}
      />
    );
  }
}
