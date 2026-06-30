import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Exact Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyC25MH5Uj37apM5se-1-Lfgc8BNHmtmqe4",
  authDomain: "quran-e0857.firebaseapp.com",
  projectId: "quran-e0857",
  storageBucket: "quran-e0857.firebasestorage.app",
  messagingSenderId: "985157539752",
  appId: "1:985157539752:web:03d5196ced4d30a7016f9d",
  measurementId: "G-24TJEDNLKZ"
};

const isConfigured = !!firebaseConfig.apiKey;

let app;
let db: any = null;
let auth: any = null;

if (isConfigured) {
  try {
    // Clear any cached Firebase app instances to ensure the newly configured app is used
    getApps().forEach((existingApp) => {
      deleteApp(existingApp).catch(() => {});
    });

    app = initializeApp(firebaseConfig);
    const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID;
    // Connect to the default database if no database ID is provided
    db = (dbId && dbId.trim() !== "") ? getFirestore(app, dbId.trim()) : getFirestore(app);
    auth = getAuth(app);

    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firestore persistence failed-precondition (multiple tabs open)');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence unimplemented in this browser');
      }
    });
  } catch (error: any) {
    console.warn("Error initializing Firebase:", error.message || error);
  }
} else {
  console.warn("Firebase credentials not found. Using client-side memory-based emulation.");
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { db, auth, isConfigured };
export default app;
