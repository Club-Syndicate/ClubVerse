#!/bin/bash

# ClubVerse Firebase Setup Script
# This script helps set up Firebase Cloud Functions for event notifications

set -e

echo "🚀 Setting up ClubVerse Firebase Cloud Functions..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase CLI:"
    firebase login
fi

# Initialize Firebase project (if not already initialized)
if [ ! -f "firebase.json" ]; then
    echo "📝 Initializing Firebase project..."
    firebase init
else
    echo "✅ Firebase project already initialized"
fi

# Install dependencies for Cloud Functions
echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install

# Run linting to check code quality
echo "🔍 Running ESLint checks..."
npm run lint

# Run tests to ensure everything works
echo "🧪 Running tests..."
npm test

# Go back to root directory
cd ..

# Go back to root directory
cd ..

# Install Firebase SDK for the main Next.js app
echo "📦 Installing Firebase SDK for Next.js app..."
npm install firebase

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Firebase configuration"
fi

# Set up Firebase hosting (optional)
echo "🌐 Setting up Firebase hosting configuration..."

# Build the Next.js app for hosting
echo "🔨 Building Next.js app..."
npm run build
npm run export 2>/dev/null || echo "ℹ️  Static export not configured (using default build)"

# Deploy to Firebase (with confirmation)
echo ""
read -p "🚀 Deploy to Firebase now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Firebase..."
    
    # Deploy Cloud Functions
    echo "☁️  Deploying Cloud Functions..."
    firebase deploy --only functions
    
    # Deploy Firestore rules and indexes
    echo "🔒 Deploying Firestore rules and indexes..."
    firebase deploy --only firestore
    
    # Deploy hosting (if configured)
    if [ -d "out" ] || [ -d "build" ]; then
        echo "🌐 Deploying to Firebase Hosting..."
        firebase deploy --only hosting
    fi
    
    echo "✅ Deployment complete!"
    echo ""
    echo "🎉 Your ClubVerse Cloud Functions are now live!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your .env.local file with the correct Firebase configuration"
    echo "2. Test the notification system with the Firebase emulator"
    echo "3. Configure VAPID keys for web push notifications"
    echo "4. Set up proper FCM service worker in your Next.js app"
    echo ""
    echo "📖 For more information, see functions/README.md"
else
    echo "⏭️  Skipping deployment. You can deploy later with:"
    echo "firebase deploy"
fi

echo ""
echo "🎯 Setup complete! Your Cloud Functions are ready for event notifications."
echo ""
echo "🔧 To test locally:"
echo "1. Start the emulator: firebase emulators:start"
echo "2. Run your Next.js app: npm run dev"
echo "3. Create/update events to trigger notifications"
echo ""
echo "📱 To enable notifications in your app:"
echo "1. Update the Firebase configuration in lib/firebase/config.ts"
echo "2. Add the notification service to your components"
echo "3. Test with the NotificationSettings component"
