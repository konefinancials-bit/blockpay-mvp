import { create } from 'zustand';
import { collection, doc, getDocs, getDoc, onSnapshot, query, orderBy, limit, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Payment {
  id: string;
  orderId: string;
  nowpaymentsId: string;
  status: 'waiting' | 'confirming' | 'confirmed' | 'finished' | 'failed' | 'expired';
  priceAmount: number;
  priceCurrency: string;
  payAmount: number;
  payCurrency: string;
  payAddress: string;
  fxRate: number;
  createdAt: string;
  updatedAt: string;
  customerNote?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'puck' | 'card' | 'sticker';
  paymentUrl: string;
  defaultAmount?: number;
  active: boolean;
  createdAt: string;
}

export interface Merchant {
  uid: string;
  displayName: string;
  email: string;
  businessName: string;
  plan: 'starter' | 'business' | 'whitelabel';
  wallets: Record<string, string>; // coinId → address
  autoSettle: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface MerchantStore {
  merchant: Merchant | null;
  payments: Payment[];
  devices: Device[];
  loading: boolean;
  paymentsLoading: boolean;
  fetchMerchant: (uid: string) => Promise<void>;
  fetchPayments: (uid: string) => Promise<void>;
  fetchDevices: (uid: string) => Promise<void>;
  addDevice: (uid: string, device: Omit<Device, 'id'>) => Promise<string>;
  updateWallets: (uid: string, wallets: Record<string, string>) => Promise<void>;
  updateSettings: (uid: string, data: Partial<Merchant>) => Promise<void>;
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  merchant: null,
  payments: [],
  devices: [],
  loading: false,
  paymentsLoading: false,

  fetchMerchant: async (uid) => {
    set({ loading: true });
    try {
      const snap = await getDoc(doc(db, 'merchants', uid));
      if (snap.exists()) {
        set({ merchant: { uid, ...snap.data() } as Merchant });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchPayments: async (uid) => {
    set({ paymentsLoading: true });
    try {
      const q = query(
        collection(db, 'merchants', uid, 'payments'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      const payments: Payment[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment));
      set({ payments });
    } finally {
      set({ paymentsLoading: false });
    }
  },

  fetchDevices: async (uid) => {
    const q = query(collection(db, 'merchants', uid, 'devices'));
    const snap = await getDocs(q);
    const devices: Device[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Device));
    set({ devices });
  },

  addDevice: async (uid, device) => {
    const ref = await addDoc(collection(db, 'merchants', uid, 'devices'), {
      ...device,
      createdAt: new Date().toISOString(),
    });
    return ref.id;
  },

  updateWallets: async (uid, wallets) => {
    await updateDoc(doc(db, 'merchants', uid), { wallets });
    set((s) => ({ merchant: s.merchant ? { ...s.merchant, wallets } : null }));
  },

  updateSettings: async (uid, data) => {
    await updateDoc(doc(db, 'merchants', uid), { ...data, updatedAt: serverTimestamp() });
    set((s) => ({ merchant: s.merchant ? { ...s.merchant, ...data } : null }));
  },
}));
