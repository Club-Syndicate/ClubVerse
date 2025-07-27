import { Timestamp } from 'firebase/firestore';

// Shared College interface
export interface College {
  id: string;
  name: string;
  location: string;
  description: string;
  adminId: string;
  adminName: string;
  clubCount: number;
  studentCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Firebase document type (with Timestamp)
export interface CollegeFirestoreDoc {
  name: string;
  location: string;
  description: string;
  adminId: string;
  adminName: string;
  clubCount: number;
  studentCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Form data type for college operations
export interface CollegeFormData {
  name: string;
  location: string;
  description: string;
  adminName: string;
}

// Utility function to check Firebase configuration
export const isFirebaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id'
  );
};

// Utility function to convert Firestore doc to College
export const convertFirestoreDocToCollege = (
  id: string, 
  doc: CollegeFirestoreDoc
): College => {
  return {
    id,
    name: doc.name,
    location: doc.location,
    description: doc.description,
    adminId: doc.adminId,
    adminName: doc.adminName,
    clubCount: doc.clubCount,
    studentCount: doc.studentCount,
    createdAt: doc.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toDate?.()?.toISOString(),
  };
};
