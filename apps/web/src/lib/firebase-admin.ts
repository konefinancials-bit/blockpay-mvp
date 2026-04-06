import type { App } from 'firebase-admin/app';

let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  // Dynamically import to avoid build-time errors when env vars aren't set
  const { initializeApp, getApps, cert } = require('firebase-admin/app');
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp!;
  }
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  return adminApp!;
}

export function getAdminDb() {
  const { getFirestore } = require('firebase-admin/firestore');
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  const { getAuth } = require('firebase-admin/auth');
  return getAuth(getAdminApp());
}
