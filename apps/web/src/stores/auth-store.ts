import { create } from 'zustand';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut as fbSignOut, signInWithPopup, onAuthStateChanged,
  User, updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  merchantId: string | null;
  loading: boolean;
  error: string;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, businessName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  merchantId: null,
  loading: false,
  error: '',
  initialized: false,

  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, merchantId: user?.uid ?? null, initialized: true });
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: '' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      set({ error: err.message ?? 'Sign in failed' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (name, email, password, businessName) => {
    set({ loading: true, error: '' });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Create merchant profile
      await setDoc(doc(db, 'merchants', cred.user.uid), {
        uid: cred.user.uid,
        displayName: name,
        email,
        businessName,
        plan: 'starter',
        wallets: {},
        autoSettle: false,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      set({ error: err.message ?? 'Sign up failed' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: '' });
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const ref = doc(db, 'merchants', cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          email: cred.user.email,
          businessName: cred.user.displayName ?? '',
          plan: 'starter',
          wallets: {},
          autoSettle: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      set({ error: err.message ?? 'Google sign-in failed' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await fbSignOut(auth);
    set({ user: null, merchantId: null });
  },
}));
