// Build script to inject environment variables into service worker
// This should be run during your build process

const fs = require('fs');
const path = require('path');

// Try to load dotenv if available, otherwise rely on process.env
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (e) {
  // dotenv not available, relying on existing process.env
  console.log('💡 Using existing environment variables (dotenv not found)');
}

function injectFirebaseConfig() {
  const templatePath = path.join(__dirname, '../public/firebase-messaging-sw.template.js');
  const outputPath = path.join(__dirname, '../public/firebase-messaging-sw.js');

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template file not found:', templatePath);
    return;
  }

  // Read environment variables
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Validate required config
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.error('❌ Missing required Firebase config keys:', missingKeys);
    console.error('Please update your .env.local file with the correct Firebase configuration');
    return;
  }

  // Read the template file
  let swContent = fs.readFileSync(templatePath, 'utf8');

  // Replace template placeholders
  swContent = swContent.replace('{{FIREBASE_API_KEY}}', firebaseConfig.apiKey);
  swContent = swContent.replace('{{FIREBASE_AUTH_DOMAIN}}', firebaseConfig.authDomain);
  swContent = swContent.replace('{{FIREBASE_PROJECT_ID}}', firebaseConfig.projectId);
  swContent = swContent.replace('{{FIREBASE_STORAGE_BUCKET}}', firebaseConfig.storageBucket);
  swContent = swContent.replace(
    '{{FIREBASE_MESSAGING_SENDER_ID}}',
    firebaseConfig.messagingSenderId,
  );
  swContent = swContent.replace('{{FIREBASE_APP_ID}}', firebaseConfig.appId);
  swContent = swContent.replace('{{FIREBASE_MEASUREMENT_ID}}', firebaseConfig.measurementId || '');

  // Write to output file
  fs.writeFileSync(outputPath, swContent);

  console.log('✅ Firebase service worker generated successfully');
  console.log(`📝 Generated: ${outputPath}`);
}

// Run if called directly
if (require.main === module) {
  injectFirebaseConfig();
}

module.exports = { injectFirebaseConfig };
