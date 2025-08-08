/**
 * Dashboard Layout
 * Protected layout for authenticated users with navigation
 */

'use client'

import React, { ReactNode } from 'react'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

// =============================================================================
// Dashboard Layout Component
// =============================================================================

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard
      requireEmailVerification
      fallback={<DashboardUnauthenticated />}
    >
      <DashboardShell>
        {children}
      </DashboardShell>
    </AuthGuard>
  )
}

// =============================================================================
// Unauthenticated Fallback
// =============================================================================

const DashboardUnauthenticated: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Anmeldung erforderlich</h2>
        <p className="text-muted-foreground mb-6">
          Sie müssen sich anmelden, um auf das Dashboard zuzugreifen.
        </p>
        <div className="space-y-2">
          <a
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Anmelden
          </a>
        </div>
      </div>
    </div>
  )
}