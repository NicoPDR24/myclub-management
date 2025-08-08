/**
 * Auth Guard Component
 * Conditional rendering based on authentication state
 */

'use client'

import React, { ReactNode } from 'react'

import { useAuth } from './AuthProvider'

// =============================================================================
// Auth Guard Types
// =============================================================================

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  requireEmailVerification?: boolean
  requireClubMembership?: string
  requirePermission?: {
    permission: string
    clubId?: string
  }
  loading?: ReactNode
}

// =============================================================================
// Auth Guard Component
// =============================================================================

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireEmailVerification = false,
  requireClubMembership,
  requirePermission,
  loading
}) => {
  const { user, loading: authLoading, hasPermission, isClubMember } = useAuth()

  // Show loading state
  if (authLoading) {
    return (
      <>
        {loading || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}
      </>
    )
  }

  // No user - show fallback
  if (!user) {
    return <>{fallback}</>
  }

  // Email verification required but not verified
  if (requireEmailVerification && !user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">E-Mail-Verifikation erforderlich</h2>
          <p className="text-muted-foreground mb-4">
            Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.
          </p>
          <p className="text-sm text-muted-foreground">
            Prüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Bestätigungslink.
          </p>
        </div>
      </div>
    )
  }

  // Club membership required but not member
  if (requireClubMembership && !isClubMember(requireClubMembership)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Vereinsmitgliedschaft erforderlich</h2>
          <p className="text-muted-foreground">
            Sie benötigen eine Mitgliedschaft in diesem Verein, um auf diese Seite zuzugreifen.
          </p>
        </div>
      </div>
    )
  }

  // Permission required but not granted
  if (requirePermission && !hasPermission(requirePermission.permission, requirePermission.clubId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Zugriff verweigert</h2>
          <p className="text-muted-foreground">
            Sie haben nicht die erforderlichen Berechtigungen für diese Aktion.
          </p>
        </div>
      </div>
    )
  }

  // All checks passed - render children
  return <>{children}</>
}

// =============================================================================
// Unauthenticated Guard (opposite of AuthGuard)
// =============================================================================

interface UnauthenticatedGuardProps {
  children: ReactNode
  fallback?: ReactNode
  loading?: ReactNode
}

export const UnauthenticatedGuard: React.FC<UnauthenticatedGuardProps> = ({
  children,
  fallback,
  loading
}) => {
  const { user, loading: authLoading } = useAuth()

  // Show loading state
  if (authLoading) {
    return (
      <>
        {loading || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </>
    )
  }

  // User is authenticated - show fallback or redirect
  if (user) {
    return <>{fallback}</>
  }

  // No user - show children
  return <>{children}</>
}

// =============================================================================
// Role Guard
// =============================================================================

interface RoleGuardProps {
  children: ReactNode
  roles: string[]
  clubId: string
  fallback?: ReactNode
  requireAll?: boolean // If true, user must have ALL roles, if false, user must have ANY role
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  clubId,
  fallback,
  requireAll = false
}) => {
  const { user, getUserClubRole } = useAuth()

  if (!user) {
    return <>{fallback}</>
  }

  const userRole = getUserClubRole(clubId)
  
  if (!userRole) {
    return <>{fallback}</>
  }

  const hasRequiredRoles = requireAll
    ? roles.every(role => userRole === role)
    : roles.includes(userRole)

  if (!hasRequiredRoles) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default AuthGuard