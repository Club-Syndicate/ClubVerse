const admin = require('firebase-admin');

// Initialize Firebase Admin SDK for emulator
admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT || 'demo-project',
});

// Connect to emulator
admin.firestore().settings({
  host: 'localhost:8080',
  ssl: false,
});

console.log('Creating test event...');

admin
  .firestore()
  .collection('events')
  .add({
    title: 'Photography Workshop',
    date: '2024-02-15',
    time: '2:00 PM',
    location: 'Art Building',
    clubId: 'photography-club',
    collegeId: 'tech-university',
    isCollegeWide: false,
    subscribedUsers: ['user1', 'user2'],
    description: 'Learn advanced photography techniques',
  })
  .then(() => {
    console.log('✅ Test event created successfully!');
    console.log('Check the Firebase Functions logs for notification processing...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating test event:', error);
    process.exit(1);
  });
