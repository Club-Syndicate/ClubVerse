// Build script to inject environment variables into service worker
// This should be run during your build process

const fs = require('fs');
const path = require('path');

function injectFirebaseConfig() {
  const swPath = path.join(__dirname, '../public/firebase-messaging-sw.js');
  const envPath = path.join(__dirname, '../.env.local');

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

  // Read the service worker file
  let swContent = fs.readFileSync(swPath, 'utf8');

  // Replace the config object
  const configString = `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;

  swContent = swContent.replace(/const firebaseConfig = {[\s\S]*?};/, configString);

  // Write back to file
  fs.writeFileSync(swPath, swContent);

  console.log('✅ Firebase config injected into service worker');
}

// Run if this script is executed directly
if (require.main === module) {
  injectFirebaseConfig();
}

module.exports = { injectFirebaseConfig };
