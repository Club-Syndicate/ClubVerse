#!/bin/bash

echo "🚀 ClubVerse Notification System Testing Guide"
echo "=============================================="
echo ""

echo "📋 Prerequisites Check:"
echo "✅ Firebase emulators should be running on:"
echo "   - Functions: http://127.0.0.1:5001"
echo "   - Firestore: http://127.0.0.1:8080"
echo "   - UI: http://127.0.0.1:4000"
echo ""

echo "🔧 Quick Setup Commands:"
echo "1. Start emulators:"
echo "   firebase emulators:start --only functions,firestore"
echo ""
echo "2. Create test events:"
echo "   node functions/create-test-event.js"
echo ""

echo "🧪 Testing Methods:"
echo ""
echo "Method 1: Using Firestore Emulator UI"
echo "--------------------------------------"
echo "1. Open: http://127.0.0.1:4000/firestore"
echo "2. Create collection: 'events'"
echo "3. Add document with data:"
echo '{
  "title": "Photography Workshop",
  "date": "2024-02-15",
  "time": "2:00 PM",
  "location": "Art Building",
  "clubId": "photography-club",
  "collegeId": "tech-university",
  "isCollegeWide": false
}'
echo ""

echo "Method 2: Using cURL (HTTP Functions)"
echo "-------------------------------------"
echo "Test manageTopicSubscriptions:"
echo 'curl -X POST http://127.0.0.1:5001/demo-project/us-central1/manageTopicSubscriptions \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "data": {
      "action": "subscribe",
      "topic": "club_photography-club",
      "token": "test-fcm-token"
    }
  }'"'"''
echo ""

echo "Method 3: Programmatic Testing"
echo "------------------------------"
echo "Run the test script:"
echo "cd functions && node create-test-event.js"
echo ""

echo "📊 Expected Results:"
echo "==================="
echo "✅ Function logs show: 'Beginning execution of sendEventNotification'"
echo "✅ Success message: 'Event notification processed successfully'"
echo "✅ FCM payload sent to topics: 'club_photography-club'"
echo "✅ Audit records created in 'notifications' collection"
echo ""

echo "🔍 Monitoring:"
echo "=============="
echo "- Functions UI: http://127.0.0.1:4000/functions"
echo "- Firestore UI: http://127.0.0.1:4000/firestore"
echo "- Function logs in terminal running emulators"
echo ""

echo "🐛 Troubleshooting:"
echo "=================="
echo "If functions don't trigger:"
echo "1. Check firebase.json has 'runtime': 'nodejs18'"
echo "2. Verify events are created in 'events' collection"
echo "3. Ensure clubId field is present in event data"
echo "4. Check terminal logs for errors"
echo ""

echo "🎯 Success Indicators:"
echo "====================="
echo "✅ No runtime errors in firebase.json"
echo "✅ Functions load successfully"
echo "✅ Firestore triggers work"
echo "✅ Notification payloads are built correctly"
echo "✅ Audit trail is created"
echo ""

echo "Ready to test! 🚀"
