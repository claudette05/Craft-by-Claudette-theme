
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// These are your provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyALMO0s9a_SwsGpjKilVDQfqn5dPQAnIyE",
  authDomain: "craft-by-claudette-04120-158b5.firebaseapp.com",
  projectId: "craft-by-claudette-04120-158b5",
  storageBucket: "craft-by-claudette-04120-158b5.firebasestorage.app",
  messagingSenderId: "238977292587",
  appId: "1:238977292587:web:6b415ab9dc372309bd0d6e"
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
