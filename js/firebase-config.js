// ============================================================================
// PASTE YOUR FIREBASE CONFIG HERE
// Get this from: Firebase Console → Project Settings → General → Your apps → Web app
// These values are safe to commit/publish — they are public client identifiers,
// not secrets. Access is controlled separately by firestore.rules.
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAAUpWlxn-OR5Ebrvaz30s1b992FW8IXgQ",
  authDomain: "derby-2026-6482b.firebaseapp.com",
  projectId: "derby-2026-6482b",
  storageBucket: "derby-2026-6482b.firebasestorage.app",
  messagingSenderId: "288109621726",
  appId: "1:288109621726:web:754056eaadc53077d5ad4f"
};

// Get this from: Firebase Console → Project Settings → Cloud Messaging →
// Web configuration → Generate key pair

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
