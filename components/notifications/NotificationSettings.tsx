// Example component showing how to integrate event notifications
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Import notification service (when Firebase is properly installed)
// import { notificationService, useNotifications, EventNotificationPayload } from '@/lib/firebase/notifications';

// Mock data structure for demonstration
interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isSubscribed: boolean;
}

interface College {
  id: string;
  name: string;
  isSubscribed: boolean;
}

export function NotificationSettings() {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: 'photography-club',
      name: 'Photography Club',
      description: 'Capture moments, create memories',
      memberCount: 45,
      isSubscribed: false,
    },
    {
      id: 'debate-society',
      name: 'Debate Society',
      description: 'Sharpen your arguments and public speaking',
      memberCount: 32,
      isSubscribed: false,
    },
    {
      id: 'coding-club',
      name: 'Coding Club',
      description: 'Learn, code, and build amazing projects',
      memberCount: 78,
      isSubscribed: false,
    },
  ]);

  const [college, setCollege] = useState<College>({
    id: 'tech-university',
    name: 'Tech University',
    isSubscribed: false,
  });

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  // Check notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        // Initialize notification service
        // const token = await notificationService.initialize();
        // console.log('Notification permission granted, FCM token:', token);

        // Show success message
        new Notification('ClubVerse Notifications', {
          body: 'You will now receive event notifications!',
          icon: '/icons/club-icon-192.png',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle club notification subscription
  const toggleClubSubscription = async (clubId: string) => {
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
      return;
    }

    setIsLoading(true);
    try {
      const club = clubs.find((c) => c.id === clubId);
      if (!club) return;

      // Toggle subscription using notification service
      if (club.isSubscribed) {
        // await notificationService.unsubscribeFromClub(clubId);
        console.log(`Unsubscribed from ${club.name}`);
      } else {
        // await notificationService.subscribeToClub(clubId);
        console.log(`Subscribed to ${club.name}`);
      }

      // Update local state
      setClubs((prev) =>
        prev.map((c) => (c.id === clubId ? { ...c, isSubscribed: !c.isSubscribed } : c)),
      );
    } catch (error) {
      console.error('Error toggling club subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle college-wide notification subscription
  const toggleCollegeSubscription = async () => {
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
      return;
    }

    setIsLoading(true);
    try {
      if (college.isSubscribed) {
        // await notificationService.unsubscribeFromCollege(college.id);
        console.log(`Unsubscribed from ${college.name} college-wide notifications`);
      } else {
        // await notificationService.subscribeToCollege(college.id);
        console.log(`Subscribed to ${college.name} college-wide notifications`);
      }

      setCollege((prev) => ({ ...prev, isSubscribed: !prev.isSubscribed }));
    } catch (error) {
      console.error('Error toggling college subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle incoming notifications (when app is in foreground)
  useEffect(() => {
    // Set up foreground message handler
    // notificationService.setupForegroundMessageHandler((payload: EventNotificationPayload) => {
    //   console.log('Received foreground notification:', payload);
    //   // Show custom in-app notification
    //   const { notification, data } = payload;
    //
    //   // You could show a toast, modal, or other in-app notification here
    //   // Example: toast.success(notification.title, { description: notification.body });
    // });
    // Handle notification clicks (when app was opened from notification)
    // notificationService.handleNotificationClick();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage your event notifications and stay updated with club activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Permission Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Browser Notifications</h3>
              <p className="text-sm text-gray-600">
                Allow ClubVerse to send you push notifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={notificationPermission === 'granted' ? 'default' : 'secondary'}>
                {notificationPermission === 'granted'
                  ? 'Enabled'
                  : notificationPermission === 'denied'
                  ? 'Blocked'
                  : 'Not Set'}
              </Badge>
              {notificationPermission !== 'granted' && (
                <Button onClick={requestNotificationPermission} disabled={isLoading} size="sm">
                  Enable
                </Button>
              )}
            </div>
          </div>

          {/* College-wide Notifications */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{college.name} - College-wide Events</h3>
              <p className="text-sm text-gray-600">
                Receive notifications for college-wide events and announcements
              </p>
            </div>
            <Switch
              checked={college.isSubscribed}
              onCheckedChange={toggleCollegeSubscription}
              disabled={notificationPermission !== 'granted' || isLoading}
            />
          </div>

          {/* Club Subscriptions */}
          <div>
            <h3 className="font-medium mb-4">Club Notifications</h3>
            <div className="space-y-4">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{club.name}</h4>
                      <Badge variant="outline">{club.memberCount} members</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{club.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {club.isSubscribed && (
                      <Badge variant="default" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Subscribed
                      </Badge>
                    )}
                    <Switch
                      checked={club.isSubscribed}
                      onCheckedChange={() => toggleClubSubscription(club.id)}
                      disabled={notificationPermission !== 'granted' || isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preview */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Test Notification</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (notificationPermission === 'granted') {
                    new Notification('Test Event Notification', {
                      body: 'This is how event notifications will appear!',
                      icon: '/icons/club-icon-192.png',
                      badge: '/icons/badge-icon-72.png',
                    });
                  } else {
                    alert('Please enable notifications first');
                  }
                }}
                disabled={notificationPermission !== 'granted'}
              >
                Send Test Notification
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enable browser notifications to receive real-time updates</li>
              <li>• Subscribe to clubs you're interested in to get event notifications</li>
              <li>• College-wide notifications include important announcements</li>
              <li>• You can manage your subscriptions anytime from this page</li>
              <li>• Notifications will appear even when ClubVerse is closed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
