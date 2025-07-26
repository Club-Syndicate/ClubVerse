// Notification service for managing FCM tokens and topic subscriptions
import React from 'react';
import { messaging } from './config';
import { httpsCallable } from 'firebase/functions';
import { functions } from './config';
import { getToken, onMessage } from 'firebase/messaging';

// Get the callable function for managing topic subscriptions
const manageTopicSubscriptions = httpsCallable(functions, 'manageTopicSubscriptions');

export class NotificationService {
  private static instance: NotificationService;
  private currentToken: string | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service and request permission
   */
  async initialize(): Promise<string | null> {
    try {
      // Check if messaging is supported
      const messagingInstance = await messaging;
      if (!messagingInstance) {
        console.log('Firebase messaging is not supported in this browser');
        return null;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Get registration token
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const token = await getToken(messagingInstance, {
        vapidKey: vapidKey,
      });

      if (token) {
        this.currentToken = token;
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.currentToken;
  }

  /**
   * Subscribe to a club's notifications
   */
  async subscribeToClub(clubId: string): Promise<boolean> {
    const token = this.currentToken || (await this.initialize());

    if (!token) {
      console.error('No FCM token available for subscription');
      return false;
    }

    try {
      const topic = `club_${clubId}`;
      const result = await manageTopicSubscriptions({
        action: 'subscribe',
        topic: topic,
        token: token,
      });

      console.log(`Successfully subscribed to ${topic}`);
      return true;
    } catch (error) {
      console.error('Error subscribing to club notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from a club's notifications
   */
  async unsubscribeFromClub(clubId: string): Promise<boolean> {
    const token = this.currentToken || (await this.initialize());

    if (!token) {
      console.error('No FCM token available for unsubscription');
      return false;
    }

    try {
      const topic = `club_${clubId}`;
      const result = await manageTopicSubscriptions({
        action: 'unsubscribe',
        topic: topic,
        token: token,
      });

      console.log(`Successfully unsubscribed from ${topic}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from club notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to college-wide notifications
   */
  async subscribeToCollege(collegeId: string): Promise<boolean> {
    const token = this.currentToken || (await this.initialize());

    if (!token) {
      console.error('No FCM token available for subscription');
      return false;
    }

    try {
      const topic = `college_${collegeId}`;
      const result = await manageTopicSubscriptions({
        action: 'subscribe',
        topic: topic,
        token: token,
      });

      console.log(`Successfully subscribed to ${topic}`);
      return true;
    } catch (error) {
      console.error('Error subscribing to college notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from college-wide notifications
   */
  async unsubscribeFromCollege(collegeId: string): Promise<boolean> {
    const token = this.currentToken || (await this.initialize());

    if (!token) {
      console.error('No FCM token available for unsubscription');
      return false;
    }

    try {
      const topic = `college_${collegeId}`;
      const result = await manageTopicSubscriptions({
        action: 'unsubscribe',
        topic: topic,
        token: token,
      });

      console.log(`Successfully unsubscribed from ${topic}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from college notifications:', error);
      return false;
    }
  }

  /**
   * Set up foreground message handler
   */
  setupForegroundMessageHandler(callback: (payload: any) => void): void {
    if (messaging) {
      messaging
        .then((messagingInstance) => {
          if (messagingInstance) {
            onMessage(messagingInstance, (payload: any) => {
              console.log('Message received in foreground:', payload);
              callback(payload);
            });
          }
        })
        .catch((error) => {
          console.error('Error setting up foreground message handler:', error);
        });
    }
  }

  /**
   * Handle background message clicks (for when app is in background/closed)
   * This should be called when the app loads to handle notification clicks
   */
  handleNotificationClick(): void {
    // Check if app was opened from a notification
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    const notificationType = urlParams.get('type');

    if (eventId && notificationType === 'event_notification') {
      // Navigate to event page
      window.location.href = `/events/${eventId}`;
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Types for notification payloads
export interface EventNotificationPayload {
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
  };
  data: {
    eventId: string;
    clubId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    type: 'event_notification';
    timestamp: string;
  };
}

// Hook for React components
export function useNotifications() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const initializeNotifications = async () => {
      const token = await notificationService.initialize();
      setCurrentToken(token);
      setHasPermission(token !== null);
      setIsInitialized(true);
    };

    initializeNotifications();
  }, []);

  return {
    isInitialized,
    hasPermission,
    currentToken,
    subscribeToClub: notificationService.subscribeToClub.bind(notificationService),
    unsubscribeFromClub: notificationService.unsubscribeFromClub.bind(notificationService),
    subscribeToCollege: notificationService.subscribeToCollege.bind(notificationService),
    unsubscribeFromCollege: notificationService.unsubscribeFromCollege.bind(notificationService),
  };
}
