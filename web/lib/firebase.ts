/**
 * Firebase SDK Configuration
 * Modern Firebase v9+ SDK with type safety and optimized imports
 */

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  connectAuthEmulator,
  type Auth,
  type User as FirebaseUser
} from 'firebase/auth'
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  type Firestore,
  type FirestoreSettings
} from 'firebase/firestore'
import { 
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage
} from 'firebase/storage'
import { 
  getFunctions,
  connectFunctionsEmulator,
  type Functions
} from 'firebase/functions'

// =============================================================================
// Firebase Configuration
// =============================================================================

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Validate required config
const requiredConfigKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
] as const

for (const key of requiredConfigKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required Firebase config: ${key}`)
  }
}

// =============================================================================
// Firebase App Initialization
// =============================================================================

let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let functions: Functions

/**
 * Initialize Firebase services
 */
const initializeFirebase = (): {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
  functions: Functions
} => {
  // Initialize Firebase App
  app = initializeApp(firebaseConfig)
  
  // Initialize Authentication
  auth = getAuth(app)
  
  // Initialize Firestore with optimized settings
  const firestoreSettings: FirestoreSettings = {
    experimentalForceLongPolling: false,
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
    ignoreUndefinedProperties: true
  }
  
  db = getFirestore(app)
  
  // Initialize Storage
  storage = getStorage(app)
  
  // Initialize Functions
  functions = getFunctions(app, 'europe-west1') // Use closest region
  
  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_USE_PRODUCTION) {
    connectToEmulators()
  }
  
  return { app, auth, db, storage, functions }
}

/**
 * Connect to Firebase emulators for local development
 */
const connectToEmulators = (): void => {
  try {
    // Connect Auth Emulator
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }
    
    // Connect Firestore Emulator
    if (!db._delegate._terminated) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
    
    // Connect Storage Emulator
    connectStorageEmulator(storage, 'localhost', 9199)
    
    // Connect Functions Emulator
    connectFunctionsEmulator(functions, 'localhost', 5001)
    
    console.log('🔧 Connected to Firebase emulators')
  } catch (error) {
    console.warn('⚠️ Failed to connect to emulators:', error)
  }
}

/**
 * Network status management for Firestore
 */
export const firebaseNetwork = {
  enable: async (): Promise<void> => {
    try {
      await enableNetwork(db)
      console.log('📡 Firebase network enabled')
    } catch (error) {
      console.error('Failed to enable Firebase network:', error)
    }
  },
  
  disable: async (): Promise<void> => {
    try {
      await disableNetwork(db)
      console.log('📴 Firebase network disabled')
    } catch (error) {
      console.error('Failed to disable Firebase network:', error)
    }
  }
}

// =============================================================================
// Initialize and Export Services
// =============================================================================

const firebase = initializeFirebase()

export const { 
  app: firebaseApp, 
  auth: firebaseAuth, 
  db: firebaseDb, 
  storage: firebaseStorage, 
  functions: firebaseFunctions 
} = firebase

// =============================================================================
// Auth State Management
// =============================================================================

export type AuthUser = FirebaseUser | null

/**
 * Firebase Auth state observer with cleanup
 */
export const onAuthStateChanged = (
  callback: (user: AuthUser) => void,
  errorCallback?: (error: Error) => void
): (() => void) => {
  const { onAuthStateChanged } = require('firebase/auth')
  
  return onAuthStateChanged(
    firebaseAuth,
    callback,
    errorCallback || ((error: Error) => console.error('Auth state error:', error))
  )
}

// =============================================================================
// Error Handling
// =============================================================================

/**
 * Firebase-specific error types
 */
export interface FirebaseError {
  code: string
  message: string
  name: string
}

/**
 * Check if error is a Firebase error
 */
export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as { code: unknown }).code === 'string'
  )
}

/**
 * Get user-friendly error message
 */
export const getFirebaseErrorMessage = (error: unknown): string => {
  if (!isFirebaseError(error)) {
    return 'Ein unbekannter Fehler ist aufgetreten'
  }
  
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Benutzer nicht gefunden',
    'auth/wrong-password': 'Falsches Passwort',
    'auth/email-already-in-use': 'E-Mail-Adresse bereits vergeben',
    'auth/weak-password': 'Passwort zu schwach',
    'auth/invalid-email': 'Ungültige E-Mail-Adresse',
    'auth/user-disabled': 'Benutzerkonto deaktiviert',
    'auth/too-many-requests': 'Zu viele Anfragen, bitte versuchen Sie es später erneut',
    'permission-denied': 'Keine Berechtigung für diese Aktion',
    'not-found': 'Dokument nicht gefunden',
    'already-exists': 'Dokument existiert bereits',
    'resource-exhausted': 'Ressourcen erschöpft, bitte versuchen Sie es später erneut',
    'unauthenticated': 'Anmeldung erforderlich',
    'unavailable': 'Dienst vorübergehend nicht verfügbar'
  }
  
  return errorMessages[error.code] || `Fehler: ${error.message}`
}

// =============================================================================
// Development Utilities
// =============================================================================

/**
 * Development-only Firebase utilities
 */
export const firebaseDevTools = process.env.NODE_ENV === 'development' ? {
  /**
   * Clear all Firestore data (emulator only)
   */
  clearFirestore: async (): Promise<void> => {
    if (process.env.NEXT_PUBLIC_FIREBASE_USE_PRODUCTION) {
      throw new Error('Cannot clear production Firestore!')
    }
    
    try {
      const response = await fetch(
        `http://localhost:8080/emulator/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`,
        { method: 'DELETE' }
      )
      
      if (response.ok) {
        console.log('🗑️ Firestore emulator data cleared')
      } else {
        throw new Error('Failed to clear Firestore')
      }
    } catch (error) {
      console.error('Failed to clear Firestore:', error)
    }
  },
  
  /**
   * Get emulator status
   */
  getEmulatorStatus: async (): Promise<Record<string, boolean>> => {
    const services = ['auth', 'firestore', 'functions', 'storage']
    const status: Record<string, boolean> = {}
    
    for (const service of services) {
      try {
        const ports = { auth: 9099, firestore: 8080, functions: 5001, storage: 9199 }
        const response = await fetch(`http://localhost:${ports[service]}`)
        status[service] = response.ok
      } catch {
        status[service] = false
      }
    }
    
    return status
  }
} : undefined

export default firebase