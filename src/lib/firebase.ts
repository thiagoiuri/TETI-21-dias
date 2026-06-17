import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Load config without crashing if the file is missing (e.g. if gitignored)
const configModules = import.meta.glob('../../firebase-applet-config.json', { eager: true });
const configJson = configModules['../../firebase-applet-config.json'] as { default: any } | undefined;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || configJson?.default?.apiKey || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || configJson?.default?.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || configJson?.default?.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || configJson?.default?.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || configJson?.default?.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || configJson?.default?.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || configJson?.default?.firestoreDatabaseId || "(default)",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

