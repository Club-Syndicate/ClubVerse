// Test script to create notifications for production events
const admin = require('firebase-admin');

// Initialize for PRODUCTION (not emulator)
admin.initializeApp({
  projectId:
    process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'your-production-project-id',
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function findAndProcessLatestEvent() {
  console.log('🔍 Looking for events in PRODUCTION Firestore...');

  try {
    // Get the latest events from production
    const eventsSnapshot = await db
      .collection('events')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();

    console.log(`📊 Found ${eventsSnapshot.size} events in production:`);

    if (eventsSnapshot.size === 0) {
      console.log('ℹ️ No events found. Create an event in your UI first.');
      return;
    }

    const latestEvent = eventsSnapshot.docs[0];
    const eventData = latestEvent.data();

    console.log('📅 Latest event:', {
      id: latestEvent.id,
      title: eventData.title,
      clubId: eventData.clubId,
      createdAt: eventData.createdAt?.toDate?.() || eventData.createdAt,
    });

    // Create notification for this event (simulating what our function would do)
    const notificationData = {
      title: '🎉 New Event Posted!',
      body: `Check out "${eventData.title}" scheduled for ${eventData.date} at ${
        eventData.time || 'TBD'
      }.`,
      eventId: latestEvent.id,
      clubId: eventData.clubId,
      createdAt: admin.firestore.Timestamp.now(),
      type: 'event_created',
      status: 'manual_test',
      data: {
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventTime: eventData.time || '',
        location: eventData.location || '',
      },
    };

    console.log('📬 Creating notification...');
    const notificationRef = await db.collection('notifications').add(notificationData);
    console.log('✅ Notification created with ID:', notificationRef.id);
    console.log('🎯 This shows what would happen when functions trigger automatically!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findAndProcessLatestEvent();
