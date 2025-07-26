const test = require('firebase-functions-test')();
const admin = require('firebase-admin');

// Mock the admin SDK
const mockMessaging = {
  sendToTopic: jest.fn(),
  sendMulticast: jest.fn(),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
};

const mockFirestore = {
  collection: jest.fn(() => ({
    add: jest.fn(),
    where: jest.fn(() => ({
      get: jest.fn(),
    })),
  })),
  Timestamp: {
    now: jest.fn(() => ({ toMillis: () => Date.now() })),
    fromDate: jest.fn(),
  },
};

admin.messaging = jest.fn(() => mockMessaging);
admin.firestore = jest.fn(() => mockFirestore);
admin.firestore.Timestamp = mockFirestore.Timestamp;
admin.firestore.FieldPath = { documentId: () => '__name__' };

// Import the functions after mocking
const { sendEventNotification, manageTopicSubscriptions } = require('../index');

describe('Cloud Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMessaging.sendToTopic.mockResolvedValue({ messageId: 'test-message-id' });
    mockMessaging.sendMulticast.mockResolvedValue({
      successCount: 1,
      failureCount: 0,
      responses: [],
    });
  });

  describe('sendEventNotification', () => {
    it('should send notification for new event creation', async () => {
      const eventData = {
        title: 'Photography Workshop',
        date: '2024-02-15',
        time: '2:00 PM',
        location: 'Art Building',
        clubId: 'photography-club',
        collegeId: 'tech-university',
      };

      const change = {
        before: { exists: false },
        after: {
          exists: true,
          data: () => eventData,
        },
      };

      const context = {
        params: { eventId: 'test-event-id' },
      };

      const wrapped = test.wrap(sendEventNotification);
      await wrapped(change, context);

      expect(mockMessaging.sendToTopic).toHaveBeenCalledWith(
        'club_photography-club',
        expect.objectContaining({
          notification: expect.objectContaining({
            title: '🎉 New Event Posted!',
            body: expect.stringContaining('Photography Workshop'),
          }),
        }),
      );
    });

    it('should send notification for event update', async () => {
      const previousData = {
        title: 'Photography Workshop',
        date: '2024-02-15',
        time: '2:00 PM',
        location: 'Art Building',
        clubId: 'photography-club',
      };

      const updatedData = {
        ...previousData,
        time: '3:00 PM', // Changed time
      };

      const change = {
        before: {
          exists: true,
          data: () => previousData,
        },
        after: {
          exists: true,
          data: () => updatedData,
        },
      };

      const context = {
        params: { eventId: 'test-event-id' },
      };

      const wrapped = test.wrap(sendEventNotification);
      await wrapped(change, context);

      expect(mockMessaging.sendToTopic).toHaveBeenCalledWith(
        'club_photography-club',
        expect.objectContaining({
          notification: expect.objectContaining({
            title: '📅 Event Updated!',
            body: expect.stringContaining('has been updated'),
          }),
        }),
      );
    });

    it('should handle event deletion', async () => {
      const change = {
        before: {
          exists: true,
          data: () => ({ title: 'Test Event' }),
        },
        after: { exists: false },
      };

      const context = {
        params: { eventId: 'test-event-id' },
      };

      const wrapped = test.wrap(sendEventNotification);
      const result = await wrapped(change, context);

      expect(result).toBeNull();
      expect(mockMessaging.sendToTopic).not.toHaveBeenCalled();
    });

    it('should send college-wide notification when isCollegeWide is true', async () => {
      const eventData = {
        title: 'College Fair',
        date: '2024-03-01',
        clubId: 'student-council',
        collegeId: 'tech-university',
        isCollegeWide: true,
      };

      const change = {
        before: { exists: false },
        after: {
          exists: true,
          data: () => eventData,
        },
      };

      const context = {
        params: { eventId: 'test-event-id' },
      };

      const wrapped = test.wrap(sendEventNotification);
      await wrapped(change, context);

      expect(mockMessaging.sendToTopic).toHaveBeenCalledWith(
        'club_student-council',
        expect.any(Object),
      );

      expect(mockMessaging.sendToTopic).toHaveBeenCalledWith(
        'college_tech-university',
        expect.any(Object),
      );
    });

    it('should handle missing clubId gracefully', async () => {
      const eventData = {
        title: 'Invalid Event',
        date: '2024-02-15',
        // Missing clubId
      };

      const change = {
        before: { exists: false },
        after: {
          exists: true,
          data: () => eventData,
        },
      };

      const context = {
        params: { eventId: 'test-event-id' },
      };

      const wrapped = test.wrap(sendEventNotification);
      const result = await wrapped(change, context);

      expect(result).toBeNull();
      expect(mockMessaging.sendToTopic).not.toHaveBeenCalled();
    });
  });

  describe('manageTopicSubscriptions', () => {
    it('should subscribe user to topic', async () => {
      const data = {
        action: 'subscribe',
        topic: 'club_photography-club',
        token: 'test-fcm-token',
      };

      const context = {
        auth: { uid: 'test-user-id' },
      };

      const wrapped = test.wrap(manageTopicSubscriptions);
      const result = await wrapped(data, context);

      expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith(
        ['test-fcm-token'],
        'club_photography-club',
      );
      expect(result).toEqual({ success: true });
    });

    it('should unsubscribe user from topic', async () => {
      const data = {
        action: 'unsubscribe',
        topic: 'club_photography-club',
        token: 'test-fcm-token',
      };

      const context = {
        auth: { uid: 'test-user-id' },
      };

      const wrapped = test.wrap(manageTopicSubscriptions);
      const result = await wrapped(data, context);

      expect(mockMessaging.unsubscribeFromTopic).toHaveBeenCalledWith(
        ['test-fcm-token'],
        'club_photography-club',
      );
      expect(result).toEqual({ success: true });
    });

    it('should require authentication', async () => {
      const data = {
        action: 'subscribe',
        topic: 'club_photography-club',
        token: 'test-fcm-token',
      };

      const context = {}; // No auth

      const wrapped = test.wrap(manageTopicSubscriptions);

      await expect(wrapped(data, context)).rejects.toThrow('unauthenticated');
    });

    it('should validate action parameter', async () => {
      const data = {
        action: 'invalid-action',
        topic: 'club_photography-club',
        token: 'test-fcm-token',
      };

      const context = {
        auth: { uid: 'test-user-id' },
      };

      const wrapped = test.wrap(manageTopicSubscriptions);

      await expect(wrapped(data, context)).rejects.toThrow('invalid-argument');
    });
  });
});

// Cleanup
afterAll(() => {
  test.cleanup();
});
