# 🚀 How to Run and Test ClubVerse Notifications

## 🔥 Firebase Emulator Setup

### 1. Start Firebase Emulators

```bash
# In the root directory
firebase emulators:start
```

This will start:

- ✅ **Firestore Emulator** (port 8080)
- ✅ **Functions Emulator** (port 5001)
- ✅ **Firebase UI** (port 4000)

### 2. Access Firebase Emulator UI

Open: http://localhost:4000

You can:

- View Firestore data
- Monitor function executions
- See function logs

## 📱 Testing Cloud Functions

### Method 1: Using Firestore Emulator UI

1. **Open Firestore tab** in emulator UI (http://localhost:4000/firestore)

2. **Create test event collection**:

   - Collection: `events`
   - Document ID: `test-event-1`

3. **Add test event data**:

```json
{
  "title": "Photography Workshop",
  "date": "2024-02-15",
  "time": "2:00 PM",
  "location": "Art Building",
  "clubId": "photography-club",
  "collegeId": "tech-university",
  "isCollegeWide": false,
  "subscribedUsers": ["user1", "user2"],
  "description": "Learn advanced photography techniques"
}
```

4. **Watch the Functions tab** to see the notification trigger!

### Method 2: Using Firebase Admin SDK (CLI)

```bash
# In a new terminal, create a test script
node -e "
const admin = require('firebase-admin');
admin.initializeApp({
  projectId: 'demo-project',
  credential: admin.credential.applicationDefault()
});

// Create test event
admin.firestore().collection('events').add({
  title: 'Test Event',
  date: '2024-02-20',
  time: '3:00 PM',
  location: 'Main Hall',
  clubId: 'test-club',
  collegeId: 'test-college',
  isCollegeWide: true
}).then(() => console.log('Test event created!'));
"
```

### Method 3: Using cURL to test HTTP functions

```bash
# Test the manageTopicSubscriptions function
curl -X POST \
  http://localhost:5001/demo-project/us-central1/manageTopicSubscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "action": "subscribe",
      "topic": "club_photography-club",
      "token": "test-fcm-token"
    }
  }'
```

## 🔍 Monitoring & Debugging

### Function Logs

Watch the terminal where you ran `firebase emulators:start` for real-time logs:

```
✅ Success logs:
Event notification processed successfully for event test-event-1 (created)

❌ Error logs:
Event test-event-1 missing clubId. Cannot send notification.
```

### Firestore Collections to Monitor

1. **`notifications`** - Audit trail of sent notifications
2. **`notification_errors`** - Error logs and debugging info
3. **`events`** - Your test events

### Expected Function Flow

1. **Event Created/Updated** → Cloud Function triggers
2. **Validation** → Checks for required fields (clubId)
3. **Notification Building** → Creates FCM payload
4. **Topic Messaging** → Sends to club/college topics
5. **Audit Logging** → Records success/failure

## 🧪 Test Scenarios

### ✅ Test Case 1: New Event Creation

```json
{
  "title": "New Workshop",
  "date": "2024-03-01",
  "time": "10:00 AM",
  "location": "Lab 101",
  "clubId": "coding-club"
}
```

**Expected**: "🎉 New Event Posted!" notification

### ✅ Test Case 2: Event Update

1. Create event first
2. Update the `title` or `date` field
   **Expected**: "📅 Event Updated!" notification

### ✅ Test Case 3: Minor Update (Should Skip)

1. Create event first
2. Update only `description` field
   **Expected**: No notification (minor update)

### ✅ Test Case 4: Missing clubId

```json
{
  "title": "Invalid Event",
  "date": "2024-03-01"
  // Missing clubId
}
```

**Expected**: Error logged, no notification sent

### ✅ Test Case 5: College-wide Event

```json
{
  "title": "College Fest",
  "clubId": "student-council",
  "collegeId": "tech-university",
  "isCollegeWide": true
}
```

**Expected**: Notifications to both club AND college topics

## 🔧 Troubleshooting

### Common Issues & Solutions

**Issue**: `runtime field is required`
**Solution**: ✅ Fixed - Runtime added to firebase.json

**Issue**: `Cannot read properties of undefined (reading 'now')`
**Solution**: ✅ Fixed - Using proper Firebase timestamp methods

**Issue**: Function not triggering
**Solution**:

- Ensure event document is in `events` collection
- Check function logs for errors
- Verify clubId is present

**Issue**: No notifications received
**Solution**:

- This is normal in emulator (no real FCM tokens)
- Check function logs for "Successfully sent notification"
- Verify topics and payloads in logs

## 📲 Testing Real Notifications (Production)

### 1. Deploy to Firebase

```bash
cd functions
npm run deploy
```

### 2. Set up FCM in your app

- Add Firebase SDK to your frontend
- Request notification permissions
- Subscribe to topics using the notification helper functions

### 3. Create real events in production Firestore

- Use Firebase Console or your app
- Notifications will be sent to real devices

## 🎯 Success Indicators

✅ **Emulator Working**: Functions load without errors  
✅ **Function Triggering**: Logs show "Beginning execution"  
✅ **Validation Working**: Proper error handling for invalid data  
✅ **Notification Building**: FCM payload created successfully  
✅ **Topic Messaging**: "Successfully sent notification to topic" logs  
✅ **Audit Trail**: Records created in `notifications` collection

## 🚀 Next Steps

1. **Deploy to production**: `npm run deploy` in functions/
2. **Add to your app**: Import notification utilities
3. **Test on devices**: Real FCM tokens and notifications
4. **Monitor performance**: Use Firebase Console analytics

Your notification system is ready! 🎉
