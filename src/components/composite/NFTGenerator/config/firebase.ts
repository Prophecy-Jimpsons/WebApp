// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Utility function for getting timestamps
export const serverTimestamp = () => ({
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: (Date.now() % 1000) * 1000000
});

// Type definitions for Firestore documents
export interface NFTDocument {
  imageHash: string;
  walletAddress: string;
  prompt?: string;
  ipfsCid?: string;
  ipfsUrl?: string;
  createdAt: ReturnType<typeof serverTimestamp>;
  mintSignature?: string;
}
