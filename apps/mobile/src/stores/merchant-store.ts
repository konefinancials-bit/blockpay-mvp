import { create } from 'zustand';
import { collection, doc, getDocs, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Payment {
  id: string;
  orderId: string;
  nowpaymentsId: string;
  status: string;
  priceAmount: number;
  priceCurrency: string;
  payAmount: number;
  payCurrency: string;
  payAddress: string;
  fxRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  uid: string;
  displayName: string;
  email: string;
  businessName: string;
  plan: string;
  wallets: Record<string, string>;
  autoSettle: boolean;
}

interface MerchantStore {
  merchant: Merchant | null;
  payments: Payment[];
  fetchMerchant: (uid: string) => Promise<void>;
  fetchPayments: (uid: string) => Promise<void>;
  updateWallets: (uid: string, wallets: Record<string, string>) => Promise<void>;
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  merchant: null,
  payments: [],

  fetchMerchant: async (uid) => {
    const snap = await getDoc(doc(db, 'merchants', uid));
    if (snap.exists()) set({ merchant: { uid, ...snap.data() } as Merchant });
  },

  fetchPayments: async (uid) => {
    const q = query(collection(db, 'merchants', uid, 'payments'), orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    set({ payments: snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)) });
  },

  updateWallets: async (uid, wallets) => {
    const { updateDoc, doc: fbDoc } = await import('firebase/firestore');
    await updateDoc(fbDoc(db, 'merchants', uid), { wallets });
    set((s) => ({ merchant: s.merchant ? { ...s.merchant, wallets } : null }));
  },
}));
