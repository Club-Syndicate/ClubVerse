// Test script to verify emulator connection from frontend
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
} = require('firebase/firestore');

const firebaseConfig = {
  projectId: process.env.GCLOUD_PROJECT || 'demo-project',
  // Other config values don't matter for emulator
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
try {
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('✅ Connected to Firestore emulator');
} catch (error) {
  console.log('ℹ️ Already connected to emulator');
}

async function testEventCreation() {
  console.log('🧪 Testing event creation in emulator...');

  try {
    const eventData = {
      title: 'Frontend Test Event',
      description: 'Testing event creation from frontend simulation',
      clubId: 'test-club',
      date: '2025-07-27',
      time: '3:00 PM',
      location: 'Test Location',
      createdAt: new Date(),
      createdBy: 'testUser',
      isCollegeWide: false,
    };

    const docRef = await addDoc(collection(db, 'events'), eventData);
    console.log('✅ Event created with ID:', docRef.id);

    // This should trigger our Cloud Function in a real environment
    console.log('📡 In production, this would trigger the sendEventNotification function');
  } catch (error) {
    console.error('❌ Error creating event:', error);
  }
}

testEventCreation();
