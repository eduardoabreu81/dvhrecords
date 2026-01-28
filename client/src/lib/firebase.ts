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

// Validate configuration
function validateFirebaseConfig() {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('❌ Firebase configuration incomplete. Missing fields:', missingFields);
    return false;
  }
  
  return true;
}

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let initError: Error | null = null;

try {
  if (validateFirebaseConfig()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
  }
} catch (error) {
  initError = error as Error;
  console.error('❌ Firebase initialization error:', error);
  
  // Show user-friendly error in development
  if (import.meta.env.DEV) {
    console.error(`
      🔥 Firebase Setup Required:
      
      Please ensure the following environment variables are set:
      - VITE_FIREBASE_API_KEY
      - VITE_FIREBASE_AUTH_DOMAIN
      - VITE_FIREBASE_PROJECT_ID
      - VITE_FIREBASE_STORAGE_BUCKET
      - VITE_FIREBASE_MESSAGING_SENDER_ID
      - VITE_FIREBASE_APP_ID
      
      Check your .env file or Netlify environment variables.
    `);
  }
}

// Helper to check if Firebase is ready
export function isFirebaseReady(): boolean {
  return !!(app && db && auth) && !initError;
}

// Helper to get initialization error
export function getFirebaseError(): Error | null {
  return initError;
}

export { app, db, auth };