import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Retrieve credentials from Vite environment variables (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if credentials are set (not empty or undefined)
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase Firestore initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase App:", error);
  }
} else {
  console.warn(
    "Firebase credentials not found. Falling back to local simulated mock database."
  );
}

export { app, db, isFirebaseConfigured };
