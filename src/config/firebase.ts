import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For debugging - remove in production
console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prophecy-jimpsons",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let dbInstance;

try {
  app = initializeApp(firebaseConfig);

  // Create Firestore instance
  dbInstance = getFirestore(app);

  // Verify database connection
  console.log("Firestore initialized with project:", firebaseConfig.projectId);
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export const db = dbInstance;
