/**
 * Dashboard Preview Component
 * Shows authenticated users a preview/redirect to dashboard
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'

// =============================================================================
// Dashboard Preview Component
// =============================================================================

export const DashboardPreview: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()

  React.useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">
          Weiterleitung zum Dashboard...
        </p>
      </div>
    </div>
  )
}

export default DashboardPreview