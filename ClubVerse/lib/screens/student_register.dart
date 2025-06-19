import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../theme/app_theme.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

class StudentRegisterScreen extends StatefulWidget {
  const StudentRegisterScreen({super.key});

  @override
  State<StudentRegisterScreen> createState() => _StudentRegisterScreenState();
}

class _StudentRegisterScreenState extends State<StudentRegisterScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _name = TextEditingController();
  final _studentId = TextEditingController();
  final _department = TextEditingController();
  int _year = 1;

  Map<String, dynamic>? _selectedCollege;
  List<Map<String, dynamic>> _colleges = [];

  String? _error;
  bool _isLoading = false;
  File? _profileImage;

  @override
  void initState() {
    super.initState();
    _loadColleges();
  }

  Future<void> _loadColleges() async {
    // Predefined list of colleges with their domains
    final List<Map<String, dynamic>> predefinedColleges = [
      {
        'id': 'vit',
        'name': 'Vishwakarma Institute of Technology',
        'domain': 'vit.edu',
      },
      {
        'id': 'viit',
        'name': 'Vishawakarma Institute of Information Technology',
        'domain': 'viit.ac.in',
      },
      {
        'id': 'adypsoe',
        'name': 'Ajinkya DY Patil School of Engineering',
        'domain': 'dypic.in',
      },
      {
        'id': 'yale',
        'name': 'Yale University',
        'domain': 'yale.edu',
      },
      {
        'id': 'princeton',
        'name': 'Princeton University',
        'domain': 'princeton.edu',
      },
      {
        'id': 'columbia',
        'name': 'Columbia University',
        'domain': 'columbia.edu',
      },
      {
        'id': 'berkeley',
        'name': 'UC Berkeley',
        'domain': 'berkeley.edu',
      },
      {
        'id': 'oxford',
        'name': 'University of Oxford',
        'domain': 'ox.ac.uk',
      },
      {
        'id': 'cambridge',
        'name': 'University of Cambridge',
        'domain': 'cam.ac.uk',
      },
      {
        'id': 'caltech',
        'name': 'California Institute of Technology',
        'domain': 'caltech.edu',
      },
    ];

    try {
      // First try to load from Firestore
      final snapshot =
          await FirebaseFirestore.instance.collection('colleges').get();

      print('Loaded ${snapshot.docs.length} colleges from Firestore');

      final collegeList = snapshot.docs.map((doc) {
        final data = doc.data();
        return {
          'id': doc.id,
          'name': data['name'] ?? 'Unknown College',
          'domain': data['domain'] ?? 'example.com',
        };
      }).toList();

      // If colleges found in Firestore, use them
      if (collegeList.isNotEmpty) {
        setState(() {
          _colleges = collegeList;
          _selectedCollege = _colleges.isNotEmpty ? _colleges[0] : null;
          _isLoading = false;
        });
      } else {
        // If no colleges found in Firestore, use the predefined list
        print('No colleges found in Firestore, using predefined list');
        setState(() {
          _colleges = predefinedColleges;
          _selectedCollege = _colleges[0];
          _isLoading = false;
        });
      }
    } catch (e) {
      // If there's an error loading from Firestore, use the predefined list
      print('Error loading colleges from Firestore: $e');
      print('Using predefined college list instead');
      setState(() {
        _error = null; // Clear any previous error
        _isLoading = false;
        _colleges = predefinedColleges;
        _selectedCollege = _colleges[0];
      });
    }
  }

  Future<void> _registerStudent() async {
    final email = _email.text.trim();
    final password = _password.text;
    final name = _name.text.trim();
    final studentId = _studentId.text.trim();
    final department = _department.text.trim();

    if (_selectedCollege == null) {
      setState(() => _error = 'Please select a college');
      return;
    }

    if (!email.endsWith('@${_selectedCollege!['domain']}')) {
      setState(() => _error = 'Email must be from ${_selectedCollege!['domain']}');
      return;
    }

    if ([email, password, name, studentId, department].any((e) => e.isEmpty)) {
      setState(() => _error = 'All fields are required');
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final userCred = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);

      final uid = userCred.user!.uid;

      await FirebaseFirestore.instance.collection('users').doc(uid).set({
        'role': 'student',
        'email': email,
        'name': name,
        'studentId': studentId,
        'course': department,
        'year': _year,
        'collegeId': _selectedCollege!['id'],
      });

      await userCred.user!.sendEmailVerification();

      Navigator.pushReplacementNamed(context, '/verify-email');
    } catch (e) {
      setState(() => _error = 'Registration failed: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _pickProfileImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _profileImage = File(pickedFile.path);
      });
    }
  }

  Widget _buildInput(String label, TextEditingController controller,
      {bool obscure = false, IconData? prefixIcon}) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5FF),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscure,
        decoration: InputDecoration(
          hintText: label,
          prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Registration'),
        backgroundColor: const Color(0xFF7C4DFF),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Logo
                  const Text(
                    'UNICLUB',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF7C4DFF),
                    ),
                  ),
                  const SizedBox(height: 40),
                  // Registration title
                  const Text(
                    'STUDENT REGISTRATION',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // College selection
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: DropdownButtonFormField<Map<String, dynamic>>(
                      value: _selectedCollege,
                      onChanged: (val) => setState(() => _selectedCollege = val),
                      items: _colleges
                          .map((college) => DropdownMenuItem(
                                value: college,
                                child: Text(college['name']),
                              ))
                          .toList(),
                      decoration: const InputDecoration(
                        hintText: 'Select College',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 16),
                      ),
                      icon: const Icon(Icons.school_outlined),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildInput('College Email', _email, prefixIcon: Icons.email_outlined),
                  const SizedBox(height: 16),
                  _buildInput('Password', _password, obscure: true, prefixIcon: Icons.lock_outline),
                  const SizedBox(height: 16),
                  _buildInput('Full Name', _name, prefixIcon: Icons.person_outline),
                  const SizedBox(height: 16),
                  _buildInput('Student ID', _studentId, prefixIcon: Icons.badge_outlined),
                  const SizedBox(height: 16),
                  _buildInput('Department / Course', _department, prefixIcon: Icons.school_outlined),
                  const SizedBox(height: 16),
                  // Year selection
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F5FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: DropdownButtonFormField<int>(
                      value: _year,
                      onChanged: (val) => setState(() => _year = val!),
                      items: List.generate(
                          4,
                          (i) => DropdownMenuItem(
                              value: i + 1, child: Text('${i + 1} Year'))),
                      decoration: const InputDecoration(
                        hintText: 'Year of Study',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 16),
                      ),
                      icon: const Icon(Icons.calendar_today_outlined),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Profile Image Picker
                  GestureDetector(
                    onTap: _pickProfileImage,
                    child: CircleAvatar(
                      radius: 48,
                      backgroundColor: Colors.grey[200],
                      backgroundImage: _profileImage != null ? FileImage(_profileImage!) : null,
                      child: _profileImage == null
                          ? const Icon(Icons.camera_alt, size: 36, color: Colors.grey)
                          : null,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text('Tap to select a profile image'),
                  // Register button
                  Center(
                    child: SizedBox(
                      width: 150,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _registerStudent,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF7C4DFF),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          disabledBackgroundColor: AppTheme.primaryColor.withOpacity(0.6),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text('Register'),
                      ),
                    ),
                  ),
                  if (_error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: Center(
                        child: Text(
                          _error!,
                          style: const TextStyle(color: AppTheme.errorColor, fontSize: 14),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
            ),
    );
  }
}
