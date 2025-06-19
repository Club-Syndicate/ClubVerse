# ClubVerse - College Club Management Platform

ClubVerse is a comprehensive Flutter application designed to streamline the management of college clubs. It provides a platform for students to discover and join clubs, for club administrators to manage their clubs, and for college administrators to oversee all club activities within their institution.

## Features

### For Students
- Browse and join clubs in their college
- View club details, events, and announcements
- Track club membership and activities
- Receive notifications about club events

### For Club Administrators
- Manage club details and membership
- Create and publish events
- Send announcements to club members
- Track attendance and participation

### For College Administrators
- Approve and manage clubs within their college
- Monitor club activities and events
- Create new clubs and assign club administrators
- Generate reports on club performance

### For Super Administrators
- Manage colleges in the system
- Create college administrator accounts
- Monitor system-wide activities
- Configure global settings

## Tech Stack

- **Frontend**: Flutter (Dart)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage

## Project Structure

```
lib/
├── auth/
│   └── auth_service.dart       # Authentication service
├── firebase_options.dart       # Firebase configuration
├── main.dart                   # Application entry point
├── screens/                    # UI screens
│   ├── club_dashboard.dart     # Club admin dashboard
│   ├── college_admin_dashboard.dart # College admin dashboard
│   ├── create_club_screen.dart # Club creation screen
│   ├── login_screen.dart       # Authentication screen
│   ├── student_dashboard.dart  # Student dashboard
│   ├── student_email_verification_screen.dart # Email verification
│   ├── student_register.dart   # Student registration
│   └── super_admin_dashboard.dart # Super admin dashboard
├── services/
│   └── user_service.dart       # User management service
├── theme/
│   └── app_theme.dart          # App theme configuration
└── widgets/
    └── loading_spinner.dart    # Reusable loading widget
```

## Setup Instructions

### Prerequisites

- Flutter SDK (version 3.7.0 or higher)
- Dart SDK (version 3.0.0 or higher)
- Firebase account
- Android Studio / VS Code
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ClubVerse.git
cd ClubVerse
```

2. **Install dependencies**

```bash
flutter pub get
```

3. **Firebase Setup**

- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Create Cloud Firestore database
- Set up Firebase Storage
- Add your application to the Firebase project:
  - For Android: Register app with package name and download google-services.json
  - For iOS: Register app with bundle ID and download GoogleService-Info.plist
  - For Web: Register app and add the Firebase configuration to your web/index.html

4. **Update Firebase configuration**

The project already includes Firebase configuration in `lib/main.dart`. Replace the existing configuration with your own Firebase project details:

```dart
await Firebase.initializeApp(
  options: const FirebaseOptions(
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  ),
);
```

5. **Run the application**

```bash
flutter run
```

## Firebase Database Structure

### Collections

- **users**: Contains user information and roles
  - Fields: email, name, role, collegeId, clubId, permissionLevel

- **colleges**: Contains college information
  - Fields: name, domain, adminUid

- **clubs**: Contains club information
  - Fields: name, description, category, logoUrl, bannerUrl, meetingSchedule, rules, adminUid, collegeId

## User Roles

1. **Super Admin**: System-wide administrator
2. **College Admin**: Administrator for a specific college
3. **Club Admin**: Administrator for a specific club
4. **Student**: Regular user who can join clubs

## Authentication Flow

1. **Student Registration**:
   - Students register with college email
   - Email verification required
   - Profile creation

2. **Admin Creation**:
   - Super Admin creates College Admins
   - College Admins create Club Admins
   - Temporary passwords are sent via email

3. **Authentication Methods**:
   - Email/Password authentication is fully implemented
   - Google Sign-In is not yet completed and requires implementation

## Development Guidelines

### Code Style

- Follow the [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)
- Use camelCase for variables and methods
- Use PascalCase for classes and enums

### Adding New Features

1. Create new screen in the screens directory
2. Add the route in main.dart
3. Implement the feature logic
4. Update the README if necessary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Setup (Flutter & Firebase) -- not required as currently the firebase creds are hardcoded (19/6/2025). Change that before putting the project on open source contribution

1. **Install dependencies:**
   ```sh
   flutter pub get
   ```
   ## simply setting up flutter via terminal will work and download all the necessary things required that are defined in the directory

2. **Firebase configuration:**
   - Add your `google-services.json` to `android/app/`.
   - Add your `GoogleService-Info.plist` to `ios/Runner/`.
   - These files are not included in the repository for security reasons (see `.gitignore`).

3. **Run the app:**
   ```sh
   flutter run
   ```

## Notes
- Build outputs and IDE/editor settings are ignored via `.gitignore`.
- If you use a different Firebase project, update the config files accordingly.
- Do not commit build outputs or personal config files.
