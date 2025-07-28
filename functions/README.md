# ClubVerse Firebase Cloud Functions

This directory contains Firebase Cloud Functions for the ClubVerse platform, implementing event notification services and backend functionality.

## 🚀 Features

### Event Notification System

- **Automatic Notifications**: Sends push notifications when events are created or updated
- **Multi-Target Support**: Notifies club members, college-wide audiences, and specific subscribers
- **Smart Updates**: Only sends notifications for significant event changes
- **Audit Trail**: Maintains logs of all sent notifications for debugging and analytics

### Core Functions

#### `sendEventNotification`

Triggered by Firestore changes in the `events` collection.

**Triggers on:**

- Event creation
- Event updates (title, date, time, location changes)

**Notification Targets:**

- Club-specific topic: `club_{clubId}`
- College-wide topic: `college_{collegeId}` (if `isCollegeWide: true`)
- Individual user tokens for subscribed users

**Features:**

- Differentiated messaging for create vs. update operations
- Error handling and logging
- Notification audit trail storage
- Support for various event types and visibility levels

#### `manageTopicSubscriptions`

HTTP callable function for managing user FCM topic subscriptions.

**Actions:**

- `subscribe`: Subscribe user to a topic
- `unsubscribe`: Unsubscribe user from a topic

**Security:**

- Requires user authentication
- Validates input parameters

#### `cleanupOldNotifications`

Scheduled function that runs daily to clean up old notification records.

**Schedule:** Every 24 hours
**Cleanup:** Removes notification records older than 30 days

## 📱 Notification Format

### Payload Structure

```javascript
{
  notification: {
    title: "🎉 New Event Posted!" | "📅 Event Updated!",
    body: "Event details...",
    icon: "/icons/club-icon.png",
    badge: "/icons/badge-icon.png"
  },
  data: {
    eventId: "string",
    clubId: "string",
    eventTitle: "string",
    eventDate: "string",
    eventTime: "string",
    location: "string",
    type: "event_notification",
    timestamp: "string",
    clickUrl: "string"
  }
}
```

### Topic Naming Convention

- Club topics: `club_{clubId}`
- College topics: `college_{collegeId}`

## 🛠️ Setup & Deployment

### Prerequisites

- Node.js 18+
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project configured

### Installation

```bash
cd functions
npm install
```

### Local Development

```bash
# Start Firebase emulators
npm run serve

# Open emulator UI
# Navigate to http://localhost:4000
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- index.test.js
```

### Linting

```bash
# Check for lint errors
npm run lint

# Fix auto-fixable lint errors
npm run lint:fix
```

### Deployment

```bash
# Deploy all functions
npm run deploy

# Deploy specific function
firebase deploy --only functions:sendEventNotification
```

## 🔧 Configuration

### Environment Variables

Set these in Firebase Functions config:

```bash
# Set your app domain for notification click actions
firebase functions:config:set app.domain="https://your-app-domain.com"

# Set notification icons
firebase functions:config:set notifications.icon="/icons/club-icon.png"
firebase functions:config:set notifications.badge="/icons/badge-icon.png"
```

### Firestore Collections Structure

#### Events Collection (`events/{eventId}`)

```javascript
{
  title: "string",
  description: "string",
  date: "string", // YYYY-MM-DD format
  time: "string", // HH:MM AM/PM format
  location: "string",
  clubId: "string", // Required
  collegeId: "string", // Optional
  isCollegeWide: boolean, // Default: false
  subscribedUsers: ["userId1", "userId2"], // Optional
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Users Collection (`users/{userId}`)

```javascript
{
  email: "string",
  name: "string",
  role: "string", // student, club_admin, college_admin, super_admin
  fcmTokens: ["token1", "token2"], // Array of FCM tokens
  fcmToken: "string", // Legacy single token support
  // ... other user fields
}
```

#### Notifications Collection (`notifications/{notificationId}`)

```javascript
{
  eventId: "string",
  clubId: "string",
  collegeId: "string",
  type: "event_created" | "event_updated",
  title: "string",
  body: "string",
  sentAt: timestamp,
  targets: {
    clubTopic: "string",
    collegeTopic: "string",
    subscribedUsersCount: number
  }
}
```

## 🔒 Security

### Firestore Security Rules

The functions work with comprehensive Firestore security rules that:

- Restrict notification writes to Cloud Functions only
- Allow authenticated users to read notifications
- Implement role-based access control for events and users

### Function Security

- HTTP callable functions require authentication
- Input validation for all parameters
- Error handling prevents information leakage

## 📊 Monitoring & Debugging

### Cloud Function Logs

```bash
# View all function logs
npm run logs

# View specific function logs
firebase functions:log --only sendEventNotification

# Follow logs in real-time
firebase functions:log --only sendEventNotification --follow
```

### Error Tracking

- Errors are stored in `notification_errors` collection
- Includes full error stack traces and context
- Accessible to admin users for debugging

### Notification Audit

- All sent notifications logged in `notifications` collection
- Includes delivery targets and timestamps
- Useful for analytics and troubleshooting

## 🧪 Testing Strategy

### Unit Tests

- Mock Firebase Admin SDK
- Test all notification scenarios
- Validate error handling
- Check security requirements

### Integration Tests

Use Firebase Emulator Suite:

```bash
# Start emulators with test data
firebase emulators:start --import=./test-data

# Run integration tests
npm run test:integration
```

### Manual Testing

1. Create/update events in Firestore emulator
2. Verify function triggers in emulator logs
3. Check notification payloads
4. Test topic subscription management

## 🚨 Common Issues & Solutions

### Function Not Triggering

- Verify Firestore rules allow event writes
- Check function deployment status
- Review function logs for errors

### Notifications Not Delivered

- Verify FCM tokens are valid and current
- Check topic subscription status
- Review messaging service quotas

### Permission Errors

- Ensure Firebase project has necessary APIs enabled
- Verify service account permissions
- Check authentication in callable functions

## 📈 Performance Considerations

### Batch Operations

- User token retrieval uses batched queries (10 users per batch)
- Notification cleanup uses batch writes

### Rate Limiting

- FCM has sending rate limits (1 million messages per minute)
- Functions automatically handle backoff for rate limits

### Cost Optimization

- Old notifications cleaned up automatically
- Error collection prevents unbounded growth
- Efficient Firestore queries with proper indexes

## 🔄 Future Enhancements

### Planned Features

- Rich notification templates
- Notification scheduling
- User notification preferences
- Analytics dashboard
- Multi-language support

### Optimization Opportunities

- Notification batching for high-volume events
- Intelligent delivery timing
- A/B testing for notification content
- Push notification analytics integration

## 📚 Additional Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
