
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { initializeFirestore, persistentLocalCache, _forceLongPolling } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// --- FIRESTORE SECURITY RULES ---
// To fix the "Permission Denied" error, go to your Firebase Console -> Firestore -> Rules 
// and paste the following:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/

const firebaseConfig = {
  apiKey: "AIzaSyALMO0s9a_SwsGpjKilVDQfqn5dPQAnIyE",
  authDomain: "craft-by-claudette-04120-158b5.firebaseapp.com",
  projectId: "craft-by-claudette-04120-158b5",
  storageBucket: "craft-by-claudette-04120-158b5.firebasestorage.app",
  messagingSenderId: "238977292587",
  appId: "1:238977292587:web:6b415ab9dc372309bd0d6e"
};

export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use initializeFirestore to pass settings that improve reliability in restricted environments
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
  experimentalForceLongPolling: true // Helps with connectivity errors in some networks
});

export { db };
