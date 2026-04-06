import { create } from 'zustand';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string;
  init: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, businessName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, loading: false, initialized: false, error: '',

  init: () => {
    onAuthStateChanged(auth, (user) => set({ user, initialized: true }));
  },

  signIn: async (email, password) => {
    set({ loading: true, error: '' });
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (err: any) { set({ error: err.message }); throw err; }
    finally { set({ loading: false }); }
  },

  signUp: async (name, email, password, businessName) => {
    set({ loading: true, error: '' });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'merchants', cred.user.uid), {
        uid: cred.user.uid, displayName: name, email, businessName,
        plan: 'starter', wallets: {}, autoSettle: false, createdAt: serverTimestamp(),
      });
    } catch (err: any) { set({ error: err.message }); throw err; }
    finally { set({ loading: false }); }
  },

  signOut: async () => {
    await fbSignOut(auth);
    set({ user: null });
  },
}));
