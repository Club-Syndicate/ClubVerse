// Firebase messaging service worker template
// This file will have config injected during build

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Firebase configuration - will be replaced during build
const firebaseConfig = {
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}",
  measurementId: "{{FIREBASE_MEASUREMENT_ID}}"
};

// Initialize Firebase in service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'ClubVerse Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icons/club-icon-192.png',
    badge: payload.notification?.badge || '/icons/badge-icon-72.png',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Event',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ],
    requireInteraction: true,
    tag: payload.data?.eventId || 'general',
    renotify: true,
    timestamp: payload.data?.timestamp ? parseInt(payload.data.timestamp) : Date.now()
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  const { action } = event;
  const { data } = event.notification;

  if (action === 'dismiss') {
    return;
  }

  let urlToOpen = '/';

  // Use clickUrl from data payload if available (new format)
  if (data?.clickUrl) {
    urlToOpen = data.clickUrl;
  } else if (data?.eventId) {
    // Fallback for legacy format
    urlToOpen = `/events/${data.eventId}`;
  } else if (data?.clubId) {
    urlToOpen = `/clubs/${data.clubId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: data
            });
            return client.focus();
          }
        }

        if (clients.openWindow) {
          // For external URLs, use them as-is; for relative URLs, add origin
          const fullUrl = data?.clickUrl?.startsWith('http') 
            ? data.clickUrl 
            : `${self.location.origin}${urlToOpen}?utm_source=notification&type=event_notification`;
          return clients.openWindow(fullUrl);
        }
      })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.data);
});

// Service worker lifecycle
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker activating...');
  event.waitUntil(self.clients.claim());
});
