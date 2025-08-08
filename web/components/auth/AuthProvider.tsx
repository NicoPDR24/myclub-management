/**
 * Authentication Provider Component
 * React context for managing authentication state with type safety
 */

'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import { onAuthStateChanged, firebaseAuth } from '@/lib/firebase'
import { AuthService } from '@/lib/auth'
import type { User } from '../../../shared/types'

// =============================================================================
// Auth Context Types
// =============================================================================

interface AuthContextValue {
  user: User | null
  loading: boolean
  signUp: typeof AuthService.signUp
  signIn: typeof AuthService.signIn
  signOut: typeof AuthService.signOut
  resetPassword: typeof AuthService.resetPassword
  resendEmailVerification: typeof AuthService.resendEmailVerification
  updateUserPreferences: typeof AuthService.updateUserPreferences
  hasPermission: (permission: string, clubId?: string) => boolean
  getUserClubRole: (clubId: string) => string | null
  isClubMember: (clubId: string) => boolean
  refresh: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

// =============================================================================
// Create Context
// =============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// =============================================================================
// Auth Provider Component
// =============================================================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Refresh user data from Firestore
   */
  const refreshUser = async (): Promise<void> => {
    const firebaseUser = firebaseAuth.currentUser
    if (!firebaseUser) {
      setUser(null)
      return
    }

    try {
      const userData = await AuthService.getUserDocument(firebaseUser.uid)
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user data:', error)
      setUser(null)
    }
  }

  /**
   * Auth state change handler
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async firebaseUser => {
      setLoading(true)

      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Get user document from Firestore
        let userData = await AuthService.getUserDocument(firebaseUser.uid)

        // Create user document if it doesn't exist (legacy users)
        if (!userData) {
          // This should not happen in normal flow, but handle it gracefully
          console.warn('User document not found, creating new one')
          userData = await AuthService['createUserDocument'](firebaseUser)
        }

        setUser(userData)
      } catch (error) {
        console.error('Error handling auth state change:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  /**
   * Helper functions with user context
   */
  const hasPermission = (permission: string, clubId?: string): boolean => {
    if (!user) return false
    return AuthService.hasPermission(user, permission, clubId)
  }

  const getUserClubRole = (clubId: string): string | null => {
    if (!user) return null
    return AuthService.getUserClubRole(user, clubId)
  }

  const isClubMember = (clubId: string): boolean => {
    if (!user) return false
    return AuthService.isClubMember(user, clubId)
  }

  /**
   * Wrapper for updateUserPreferences with refresh
   */
  const updateUserPreferencesWithRefresh = async (
    ...args: Parameters<typeof AuthService.updateUserPreferences>
  ) => {
    const result = await AuthService.updateUserPreferences(...args)
    if (result.success) {
      await refreshUser()
    }
    return result
  }

  /**
   * Context value
   */
  const value: AuthContextValue = {
    user,
    loading,
    signUp: AuthService.signUp,
    signIn: AuthService.signIn,
    signOut: AuthService.signOut,
    resetPassword: AuthService.resetPassword,
    resendEmailVerification: AuthService.resendEmailVerification,
    updateUserPreferences: updateUserPreferencesWithRefresh,
    hasPermission,
    getUserClubRole,
    isClubMember,
    refresh: refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =============================================================================
// Auth Hook
// =============================================================================

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// =============================================================================
// Auth Guards
// =============================================================================

interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
  requireEmailVerification?: boolean
}

/**
 * Component that requires authentication
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallback = <div>Please sign in to continue</div>,
  requireEmailVerification = false
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <>{fallback}</>
  }

  if (requireEmailVerification && !user.emailVerified) {
    return <div>Please verify your email address to continue</div>
  }

  return <>{children}</>
}

interface RequirePermissionProps {
  children: ReactNode
  permission: string
  clubId?: string
  fallback?: ReactNode
}

/**
 * Component that requires specific permission
 */
export const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permission,
  clubId,
  fallback = <div>Access denied</div>
}) => {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission, clubId)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RequireClubMembershipProps {
  children: ReactNode
  clubId: string
  fallback?: ReactNode
}

/**
 * Component that requires club membership
 */
export const RequireClubMembership: React.FC<RequireClubMembershipProps> = ({
  children,
  clubId,
  fallback = <div>Club membership required</div>
}) => {
  const { isClubMember } = useAuth()

  if (!isClubMember(clubId)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// =============================================================================
// Export Types
// =============================================================================

export type { AuthContextValue, AuthProviderProps }