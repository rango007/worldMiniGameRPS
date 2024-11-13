// Firebase setup and configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: "https://worldapp-23d84-default-rtdb.firebaseio.com",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const rtdb = getDatabase(firebaseApp);
export { firebaseApp, db, rtdb, auth};
