const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Cloud Function to send event notifications when events are created or updated
 * Triggered by Firestore document changes in the events collection
 */
exports.sendEventNotification = functions.firestore
  .document('events/{eventId}')
  .onWrite(async (change, context) => {
    try {
      const eventId = context.params.eventId;
      const eventData = change.after.exists ? change.after.data() : null;
      const previousData = change.before.exists ? change.before.data() : null;

      // Handle event deletion
      if (!eventData) {
        console.log(`Event ${eventId} was deleted. No notification needed.`);
        return null;
      }

      // Determine if this is a create or update operation
      const isCreate = !previousData;
      const isUpdate = previousData && eventData;

      // Build notification payload based on operation type
      let notificationTitle;
      let notificationBody;

      if (isCreate) {
        notificationTitle = '🎉 New Event Posted!';
        notificationBody =
          `Check out "${eventData.title}" scheduled for ` +
          `${formatDate(eventData.date)} at ${eventData.time}.`;
      } else if (isUpdate) {
        // Check if important fields were updated
        const titleChanged = previousData.title !== eventData.title;
        const dateChanged = previousData.date !== eventData.date;
        const timeChanged = previousData.time !== eventData.time;
        const locationChanged = previousData.location !== eventData.location;

        if (titleChanged || dateChanged || timeChanged || locationChanged) {
          notificationTitle = '📅 Event Updated!';
          notificationBody = `"${eventData.title}" has been updated. Check the latest details!`;
        } else {
          // Minor update, skip notification
          console.log(`Minor update to event ${eventId}. Skipping notification.`);
          return null;
        }
      }

      // Validate required event data
      if (!eventData.clubId) {
        console.error(`Event ${eventId} missing clubId. Cannot send notification.`);
        return null;
      }

      // Build notification payload
      const domain = functions.config().app?.domain;
      if (!domain) {
        console.warn(
          `Function config 'app.domain' is not set. clickUrl will not be added to notifications.`,
        );
      }

      const payload = {
        notification: {
          title: notificationTitle,
          body: notificationBody,
          icon: '/icons/club-icon.png', // Add your app icon
          badge: '/icons/badge-icon.png', // Add your badge icon
        },
        data: {
          eventId: eventId,
          clubId: eventData.clubId,
          eventTitle: eventData.title,
          eventDate: eventData.date,
          eventTime: eventData.time || '',
          location: eventData.location || '',
          type: 'event_notification',
          timestamp: Date.now().toString(),
          ...(domain && { clickUrl: `${domain}/events/${eventId}` }),
        },
      };

      // Send notifications to different audiences based on event visibility
      const notificationPromises = [];

      // 1. Send to club-specific topic (all club members)
      const clubTopic = `club_${eventData.clubId}`;
      notificationPromises.push(admin.messaging().sendToTopic(clubTopic, payload));

      // 2. If event is college-wide, send to college topic
      if (eventData.isCollegeWide && eventData.collegeId) {
        const collegeTopic = `college_${eventData.collegeId}`;
        notificationPromises.push(admin.messaging().sendToTopic(collegeTopic, payload));
      }

      // 3. Send to individual users who have specifically subscribed to this club's events
      if (eventData.subscribedUsers && Array.isArray(eventData.subscribedUsers)) {
        const userTokens = await getUserTokens(eventData.subscribedUsers);
        if (userTokens.length > 0) {
          notificationPromises.push(
            admin.messaging().sendMulticast({
              tokens: userTokens,
              notification: payload.notification,
              data: payload.data,
            }),
          );
        }
      }

      // Execute all notification sends and handle results properly
      const results = await Promise.allSettled(notificationPromises);

      // Process results and log successes/failures
      let successCount = 0;
      let failureCount = 0;
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          const response = result.value;

          // Log specific success details based on notification type
          if (index === 0) {
            console.log(`Successfully sent notification to club topic ${clubTopic}:`, response);
          } else if (index === 1 && eventData.isCollegeWide) {
            const collegeTopic = `college_${eventData.collegeId}`;
            console.log(
              `Successfully sent notification to college topic ${collegeTopic}:`,
              response,
            );
          } else {
            console.log(
              `Successfully sent notifications to ${
                response.successCount || 'unknown'
              } subscribed users`,
            );
            if (response.failureCount > 0) {
              console.log(`Failed to send to ${response.failureCount} users:`, response.responses);
            }
          }
        } else {
          failureCount++;
          const error = result.reason;
          errors.push(error);

          // Log specific error details based on notification type
          if (index === 0) {
            console.error(`Error sending notification to club topic ${clubTopic}:`, error);
          } else if (index === 1 && eventData.isCollegeWide) {
            const collegeTopic = `college_${eventData.collegeId}`;
            console.error(`Error sending notification to college topic ${collegeTopic}:`, error);
          } else {
            console.error('Error sending notifications to subscribed users:', error);
          }
        }
      });

      // Log overall results
      console.log(`Notification results: ${successCount} successful, ${failureCount} failed`);

      // Only consider it a complete success if all notifications succeeded
      const allSuccessful = failureCount === 0;

      // Log successful operation for debugging
      console.log(
        `Event notification processed for event ${eventId} (${
          isCreate ? 'created' : 'updated'
        }): ` + `${successCount}/${successCount + failureCount} notifications sent successfully`,
      );

      // Store notification record for audit trail with accurate status
      await admin
        .firestore()
        .collection('notifications')
        .add({
          eventId: eventId,
          clubId: eventData.clubId,
          collegeId: eventData.collegeId || null,
          type: isCreate ? 'event_created' : 'event_updated',
          title: notificationTitle,
          body: notificationBody,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
          status: allSuccessful ? 'success' : 'partial_failure',
          results: {
            successCount: successCount,
            failureCount: failureCount,
            totalAttempts: successCount + failureCount,
          },
          targets: {
            clubTopic: clubTopic,
            collegeTopic: eventData.isCollegeWide ? `college_${eventData.collegeId}` : null,
            subscribedUsersCount: eventData.subscribedUsers ? eventData.subscribedUsers.length : 0,
          },
          errors: errors.length > 0 ? errors.map((e) => e.message) : null,
        });

      // If there were any failures, log them for debugging but don't throw
      if (failureCount > 0) {
        await admin
          .firestore()
          .collection('notification_errors')
          .add({
            eventId: context.params.eventId,
            errors: errors.map((e) => ({
              message: e.message,
              stack: e.stack,
              code: e.code,
            })),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            context: 'partial_notification_failure',
          });
      }

      return allSuccessful;
    } catch (error) {
      console.error('Error in sendEventNotification function:', error);

      // Store error for debugging
      await admin.firestore().collection('notification_errors').add({
        eventId: context.params.eventId,
        error: error.message,
        stack: error.stack,
        code: error.code,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Don't throw the error to avoid Cloud Function retries for invalid data
      return null;
    }
  });

/**
 * Helper function to format date for display
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
}

/**
 * Helper function to get FCM tokens for a list of user IDs
 */
async function getUserTokens(userIds) {
  try {
    const tokens = [];

    // Get user documents in batches (Firestore limit is 30 for 'in' queries)
    const batchSize = 30; // Firestore 'in' query limit is 30
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batchUserIds = userIds.slice(i, i + batchSize);
      const userQuery = await admin
        .firestore()
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', batchUserIds)
        .get();

      userQuery.forEach((doc) => {
        const userData = doc.data();
        if (userData.fcmTokens && Array.isArray(userData.fcmTokens)) {
          tokens.push(...userData.fcmTokens);
        } else if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });
    }

    // Remove duplicates and invalid tokens
    return [...new Set(tokens)].filter((token) => token && token.length > 0);
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
}

/**
 * Cloud Function to handle user topic subscriptions
 * Called when users join/leave clubs or change notification preferences
 */
exports.manageTopicSubscriptions = functions.https.onCall(async (data, context) => {
  // Verify user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { action, topic, token } = data;
  const uid = context.auth.uid;

  try {
    if (action === 'subscribe') {
      await admin.messaging().subscribeToTopic([token], topic);
      console.log(`User ${uid} subscribed to topic ${topic}`);
    } else if (action === 'unsubscribe') {
      await admin.messaging().unsubscribeFromTopic([token], topic);
      console.log(`User ${uid} unsubscribed from topic ${topic}`);
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
    }

    return { success: true };
  } catch (error) {
    console.error('Error managing topic subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage subscription');
  }
});

/**
 * Cloud Function to clean up old notification records
 * Scheduled to run daily to maintain database performance
 */
exports.cleanupOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldNotifications = await admin
        .firestore()
        .collection('notifications')
        .where('sentAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      const batch = admin.firestore().batch();
      oldNotifications.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${oldNotifications.size} old notification records`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  });
