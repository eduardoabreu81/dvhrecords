import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration
// IMPORTANT: Replace these values with your own Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;

let auth: Auth | undefined;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, db, auth };
