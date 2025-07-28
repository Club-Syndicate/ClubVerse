const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * BASIC VERSION - Exactly as requested in the task
 * This is a simplified version for testing
 */
exports.basicEventNotification = functions.firestore
  .document('events/{eventId}')
  .onWrite(async (change, context) => {
    console.log('🔥 BASIC trigger fired for event:', context.params.eventId);

    const eventData = change.after.exists ? change.after.data() : null;
    if (!eventData) {
      console.log('Event deleted, no notification needed');
      return null;
    }

    console.log('📊 Event data:', eventData);

    // Build notification payload - EXACTLY as in task
    const payload = {
      notification: {
        title: 'New Event Posted!',
        body: `Check out ${eventData.title} scheduled on ${eventData.date}.`,
      },
    };

    console.log('📬 Notification payload:', payload);

    // Determine target topic - EXACTLY as in task
    const topic = `club_${eventData.clubId}`;
    console.log('🎯 Target topic:', topic);

    try {
      // Send notification via Firebase Cloud Messaging - EXACTLY as in task
      const result = await admin.messaging().sendToTopic(topic, payload);
      console.log('✅ Notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      throw error;
    }
  });
