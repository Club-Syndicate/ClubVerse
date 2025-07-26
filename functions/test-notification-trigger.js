const admin = require('firebase-admin');

// Initialize Firebase Admin (for emulator)
admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT || 'your-project-id',
  credential: admin.credential.applicationDefault(),
});

// Point to emulator
admin.firestore().settings({
  host: 'localhost:8080',
  ssl: false,
});

const db = admin.firestore();

async function testNotificationTrigger() {
  console.log('🧪 Testing notification creation manually...');

  try {
    // Create a notification document directly (simulating what our function would do)
    const notificationData = {
      title: 'Manual Test Event',
      body: 'Testing notification system manually',
      eventId: 'test-event-123',
      clubId: 'testClub',
      createdAt: admin.firestore.Timestamp.now(),
      type: 'event_created',
      status: 'pending',
    };

    console.log('� Creating notification document...');
    const notificationRef = await db.collection('notifications').add(notificationData);
    console.log('✅ Notification created with ID:', notificationRef.id);

    // Check if notification was created
    const notificationsSnapshot = await db.collection('notifications').get();
    console.log(`📊 Notifications collection now has ${notificationsSnapshot.size} documents`);

    notificationsSnapshot.forEach((doc) => {
      console.log('📬 Notification:', doc.id, doc.data());
    });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
  }
}

testNotificationTrigger();
