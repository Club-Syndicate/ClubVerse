// Firebase configuration for ClubVerse Next.js app
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase config object - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  // Connect Firestore to emulator
  const { connectFirestoreEmulator } = require('firebase/firestore');
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔥 Connected to Firestore emulator');
  } catch (error) {
    console.log('Firestore emulator already connected');
  }

  // Connect Functions to emulator
  const { connectFunctionsEmulator } = require('firebase/functions');
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('🔥 Connected to Functions emulator');
  } catch (error) {
    console.log('Functions emulator already connected');
  }

  // Connect Auth to emulator
  const { connectAuthEmulator } = require('firebase/auth');
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔥 Connected to Auth emulator');
  } catch (error) {
    console.log('Auth emulator already connected');
  }
}

// Initialize Firebase Cloud Messaging (only in browser environment)
export const messaging =
  typeof window !== 'undefined'
    ? (async () => {
        try {
          const supported = await isSupported();
          return supported ? getMessaging(app) : null;
        } catch (error) {
          console.log('Firebase messaging not supported:', error);
          return null;
        }
      })()
    : null;

// Export the app instance
export default app;
