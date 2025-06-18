import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/student_register.dart';
import 'screens/student_dashboard.dart';
import 'screens/club_dashboard.dart';
import 'screens/college_admin_dashboard.dart';
import 'screens/super_admin_dashboard.dart';
import 'screens/student_email_verification_screen.dart';
import 'screens/create_club_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
  options: const FirebaseOptions(
    apiKey: "AIzaSyDnIJ515vs0y7ICMXI4JdQECa4MVwpEn_A",
    authDomain: "clubverse-4141f.firebaseapp.com",
    projectId: "clubverse-4141f",
    storageBucket: "clubverse-4141f.firebasestorage.app",
    messagingSenderId: "55531643982",
    appId: "1:55531643982:web:8002d80ff4016e8bd68f1f",
    measurementId: "G-Z79HEG7LTD"
  ),
);

  runApp(const ClubPortalApp());
}
class ClubPortalApp extends StatelessWidget {
  const ClubPortalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'College Club Portal',
      theme: AppTheme.lightTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/register': (context) => const StudentRegisterScreen(),
        '/verify-email': (context) => const StudentEmailVerificationScreen(),
        '/student-dashboard': (context) => const StudentDashboard(),
        '/club-dashboard': (context) => const ClubDashboard(),
        '/college-admin-dashboard': (context) => const CollegeAdminDashboard(),
        '/super-admin-dashboard': (context) => const SuperAdminDashboard(),
        '/create-club': (context) => const CreateClubScreen(),
      },
    );
  }
}
