/**
 * Authentication Service
 * Modern auth implementation with type safety and comprehensive error handling
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

import { firebaseAuth, firebaseDb, getFirebaseErrorMessage } from './firebase'
import type { User, CreateInput, UserPreferences } from '../../shared/types'
import { FIREBASE_CONFIG } from '../../shared/constants'
import { generateId } from '../../shared/utils'

// =============================================================================
// Auth Types
// =============================================================================

export interface SignUpData {
  email: string
  password: string
  displayName: string
  acceptedTerms: boolean
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface PasswordResetData {
  email: string
}

// =============================================================================
// Auth Service Class
// =============================================================================

export class AuthService {
  /**
   * Sign up new user with email and password
   */
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      if (!data.acceptedTerms) {
        return {
          success: false,
          error: 'Bitte akzeptieren Sie die Nutzungsbedingungen'
        }
      }

      // Create Firebase user
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      )

      // Update Firebase profile
      await updateProfile(credential.user, {
        displayName: data.displayName
      })

      // Send email verification
      await sendEmailVerification(credential.user)

      // Create user document in Firestore
      const userData = await AuthService.createUserDocument(credential.user, {
        acceptedTerms: data.acceptedTerms
      })

      return {
        success: true,
        user: userData
      }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Sign in user with email and password
   */
  static async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      )

      // Get user document from Firestore
      const userData = await AuthService.getUserDocument(credential.user.uid)

      if (!userData) {
        // Create user document if it doesn't exist (legacy users)
        const newUserData = await AuthService.createUserDocument(credential.user)
        return {
          success: true,
          user: newUserData
        }
      }

      return {
        success: true,
        user: userData
      }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<AuthResult> {
    try {
      await signOut(firebaseAuth)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(data: PasswordResetData): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(firebaseAuth, data.email)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<AuthResult> {
    try {
      const user = firebaseAuth.currentUser
      if (!user) {
        return {
          success: false,
          error: 'Kein Benutzer angemeldet'
        }
      }

      await sendEmailVerification(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Create user document in Firestore
   */
  private static async createUserDocument(
    firebaseUser: FirebaseUser,
    additionalData?: { acceptedTerms?: boolean }
  ): Promise<User> {
    const defaultPreferences: UserPreferences = {
      language: 'de',
      timezone: 'Europe/Berlin',
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        matchReminders: true,
        teamUpdates: true,
        financialUpdates: false
      }
    }

    const userData: CreateInput<User> = {
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      roles: [],
      clubMemberships: [],
      preferences: defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }

    // Save to Firestore
    const userRef = doc(firebaseDb, FIREBASE_CONFIG.collections.USERS, firebaseUser.uid)
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Return with generated ID
    return {
      id: firebaseUser.uid,
      ...userData
    }
  }

  /**
   * Get user document from Firestore
   */
  static async getUserDocument(uid: string): Promise<User | null> {
    try {
      const userRef = doc(firebaseDb, FIREBASE_CONFIG.collections.USERS, uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return null
      }

      const data = userDoc.data()
      return {
        id: uid,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as User
    } catch (error) {
      console.error('Error getting user document:', error)
      return null
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(
    uid: string,
    preferences: Partial<UserPreferences>
  ): Promise<AuthResult> {
    try {
      const userRef = doc(firebaseDb, FIREBASE_CONFIG.collections.USERS, uid)
      await setDoc(
        userRef,
        {
          preferences: {
            ...preferences
          },
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error)
      }
    }
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: User, permission: string, clubId?: string): boolean {
    if (!clubId) {
      // Global permissions
      return user.roles.some(role => role.permissions.includes(permission))
    }

    // Club-specific permissions
    const clubRole = user.roles.find(role => role.clubId === clubId)
    return clubRole?.permissions.includes(permission) || false
  }

  /**
   * Get user's highest role in club
   */
  static getUserClubRole(user: User, clubId: string): string | null {
    const clubRole = user.roles.find(role => role.clubId === clubId)
    return clubRole?.role || null
  }

  /**
   * Check if user is member of club
   */
  static isClubMember(user: User, clubId: string): boolean {
    return user.clubMemberships.some(membership => membership.clubId === clubId)
  }
}

// =============================================================================
// Auth Validation Utilities
// =============================================================================

export const validateEmail = (email: string): string | null => {
  if (!email) return 'E-Mail ist erforderlich'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ungültige E-Mail-Adresse'
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Passwort ist erforderlich'
  if (password.length < 8) return 'Passwort muss mindestens 8 Zeichen lang sein'
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Passwort muss mindestens einen Kleinbuchstaben enthalten'
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Passwort muss mindestens einen Großbuchstaben enthalten'
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Passwort muss mindestens eine Zahl enthalten'
  }
  return null
}

export const validateDisplayName = (displayName: string): string | null => {
  if (!displayName) return 'Name ist erforderlich'
  if (displayName.length < 2) return 'Name muss mindestens 2 Zeichen lang sein'
  if (displayName.length > 50) return 'Name darf maximal 50 Zeichen lang sein'
  return null
}

// =============================================================================
// Auth Context Helpers
// =============================================================================

export const isAuthenticated = (user: User | null): user is User => {
  return user !== null
}

export const requireAuth = (user: User | null): User => {
  if (!isAuthenticated(user)) {
    throw new Error('Authentication required')
  }
  return user
}

export const requireEmailVerification = (user: User): User => {
  if (!user.emailVerified) {
    throw new Error('Email verification required')
  }
  return user
}

// =============================================================================
// Export default auth service
// =============================================================================

export default AuthService