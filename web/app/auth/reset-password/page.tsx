/**
 * Password Reset Page
 * Allows users to request a password reset email
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { UnauthenticatedGuard } from '@/components/auth/AuthGuard'
import { useAuth } from '@/components/auth/AuthProvider'
import { validateEmail } from '@/lib/auth'

// =============================================================================
// Reset Password Form Data
// =============================================================================

interface ResetPasswordFormData {
  email: string
}

interface FormErrors {
  email?: string
  general?: string
}

// =============================================================================
// Reset Password Page Component
// =============================================================================

export default function ResetPasswordPage() {
  return (
    <UnauthenticatedGuard>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
          
          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Erinnerung: Sie haben bereits ein Konto?{' '}
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                Anmelden
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link 
                href="/" 
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                ← Zurück zur Startseite
              </Link>
            </p>
          </div>
        </div>
      </div>
    </UnauthenticatedGuard>
  )
}

// =============================================================================
// Reset Password Form Component
// =============================================================================

const ResetPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth()
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value })
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ email: undefined })
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await resetPassword({
        email: formData.email.trim().toLowerCase()
      })

      if (result.success) {
        setIsSubmitted(true)
      } else {
        setErrors({ general: result.error })
      }
    } catch (err) {
      setErrors({ general: 'Ein unerwarteter Fehler ist aufgetreten' })
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-success">E-Mail versendet</CardTitle>
          <CardDescription>
            Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Bitte überprüfen Sie Ihr E-Mail-Postfach ({formData.email}) und klicken Sie auf den Link in der E-Mail, um Ihr Passwort zurückzusetzen.
          </p>
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tipp: Überprüfen Sie auch Ihren Spam-Ordner, falls die E-Mail nicht im Posteingang ankommt.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setIsSubmitted(false)}
          >
            Andere E-Mail-Adresse verwenden
          </Button>
          
          <Link href="/auth/signin" className="w-full">
            <Button variant="ghost" fullWidth>
              Zurück zur Anmeldung
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Form state
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <CardTitle>Passwort zurücksetzen</CardTitle>
        <CardDescription>
          Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="E-Mail-Adresse"
            type="email"
            placeholder="ihre.email@beispiel.de"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            helperText="Wir senden Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts."
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            loadingText="E-Mail wird versendet..."
          >
            Reset-Link senden
          </Button>
          
          <Link href="/auth/signin" className="w-full">
            <Button variant="ghost" fullWidth>
              Zurück zur Anmeldung
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}