/**
 * Email Verification Page
 * Page shown after registration to guide users through email verification
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToast } from '@/components/providers/ToastProvider'

// =============================================================================
// Email Verification Page Component
// =============================================================================

export default function VerifyEmailPage() {
  const { user, resendEmailVerification } = useAuth()
  const { success, error: showError } = useToast()
  const [isResending, setIsResending] = useState(false)
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null)

  // Resend verification email
  const handleResendEmail = async () => {
    setIsResending(true)

    try {
      const result = await resendEmailVerification()
      
      if (result.success) {
        success('Bestätigungs-E-Mail gesendet', 'Bitte überprüfen Sie Ihr Postfach.')
        setLastSentAt(new Date())
      } else {
        showError('Fehler beim Senden', result.error || 'Unbekannter Fehler')
      }
    } catch (err) {
      showError('Fehler beim Senden', 'Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsResending(false)
    }
  }

  // Check if user can resend (throttle to once per minute)
  const canResend = !lastSentAt || Date.now() - lastSentAt.getTime() > 60000

  // If user is already verified, redirect to dashboard
  if (user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardTitle className="text-success">E-Mail bereits bestätigt</CardTitle>
            <CardDescription>
              Ihr E-Mail-Adresse wurde bereits erfolgreich bestätigt.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button fullWidth>
                Zum Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <CardTitle>E-Mail bestätigen</CardTitle>
            <CardDescription>
              Wir haben Ihnen eine Bestätigungs-E-Mail gesendet
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Bitte überprüfen Sie Ihr E-Mail-Postfach 
                {user?.email && (
                  <span className="font-medium"> ({user.email})</span>
                )}
                {' '}und klicken Sie auf den Bestätigungslink.
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Öffnen Sie Ihr E-Mail-Programm oder Webmail
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suchen Sie nach einer E-Mail von MyClub Management
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Klicken Sie auf den Bestätigungslink in der E-Mail
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2">💡 Tipps:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Überprüfen Sie auch Ihren Spam- oder Junk-Ordner</li>
                <li>• Die E-Mail kann einige Minuten dauern</li>
                <li>• Der Link ist 24 Stunden gültig</li>
              </ul>
            </div>

            {/* Resend section */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Keine E-Mail erhalten?
              </p>
              
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={!canResend || isResending}
                loading={isResending}
                loadingText="Wird gesendet..."
              >
                {canResend ? 'E-Mail erneut senden' : 
                  lastSentAt ? `Warten Sie ${60 - Math.floor((Date.now() - lastSentAt.getTime()) / 1000)}s` : 
                  'E-Mail erneut senden'
                }
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Link href="/auth/signin" className="w-full">
              <Button variant="ghost" fullWidth>
                Zur Anmeldung
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Falsche E-Mail-Adresse?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                >
                  Erneut registrieren
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
        
        {/* Additional help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Probleme bei der E-Mail-Bestätigung?{' '}
            <Link 
              href="/contact" 
              className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Kontaktieren Sie uns
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}