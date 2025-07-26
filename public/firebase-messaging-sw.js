// Firebase messaging service worker for background notifications
// This file must be served from the root of your domain

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Firebase configuration - make sure this matches your main app config
const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your_project_id.firebaseapp.com", 
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
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
    requireInteraction: true, // Keep notification visible until user interacts
    tag: payload.data?.eventId || 'general', // Group notifications by event
    renotify: true, // Show notification even if one with same tag exists
    timestamp: payload.data?.timestamp ? parseInt(payload.data.timestamp) : Date.now()
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  const { action } = event;
  const { data } = event.notification;

  if (action === 'dismiss') {
    // Just close the notification
    return;
  }

  // Default action or 'view' action
  let urlToOpen = '/';

  if (data?.eventId) {
    urlToOpen = `/events/${data.eventId}`;
  } else if (data?.clubId) {
    urlToOpen = `/clubs/${data.clubId}`;
  }

  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Navigate to the event page and focus
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: data
            });
            return client.focus();
          }
        }

        // If app is not open, open new window
        if (clients.openWindow) {
          const fullUrl = `${self.location.origin}${urlToOpen}?utm_source=notification&type=event_notification`;
          return clients.openWindow(fullUrl);
        }
      })
  );
});

// Handle notification close events (for analytics)
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.data);
  
  // You can send analytics data here
  // Example: track notification dismissal
  const data = event.notification.data;
  if (data?.eventId) {
    // Send analytics event for notification dismissal
    // analytics.track('notification_dismissed', { eventId: data.eventId });
  }
});

// Optional: Handle push subscription changes
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[firebase-messaging-sw.js] Push subscription changed');
  
  // Handle subscription renewal here if needed
  // This is useful for maintaining push subscriptions
});

// Service worker installation and activation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker installing...');
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker activating...');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});
