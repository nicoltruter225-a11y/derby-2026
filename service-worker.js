// Background push notification handler.
// Firebase config is duplicated here (not imported) because service workers
// can't read js/firebase-config.js directly — this must stay in sync with it.

importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || "Derby 2026";
  const options = {
    body: payload.notification?.body || "",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png"
  };
  self.registration.showNotification(title, options);
});
