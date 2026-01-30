
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// These are your provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyC3i1PMINFJse7Iu_xZiM0Za9bSa0I5w5w",
  authDomain: "craft-by-claudette-02467-36805.firebaseapp.com",
  projectId: "craft-by-claudette-02467-36805",
  storageBucket: "craft-by-claudette-02467-36805.firebasestorage.app",
  messagingSenderId: "515691180906",
  appId: "1:515691180906:web:ac0c1359bb73b40ff12b13"
};

/**
 * FIXED LOGIC: 
 * We check if the keys are NOT the default placeholders.
 * Since you've replaced them with real "AIza..." and "craft-..." strings,
 * this will now correctly return TRUE.
 */
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
