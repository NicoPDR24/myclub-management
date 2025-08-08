/**
 * Sign Up Page
 * User registration with comprehensive form validation
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { UnauthenticatedGuard } from '@/components/auth/AuthGuard'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToast } from '@/components/providers/ToastProvider'
import { validateEmail, validatePassword, validateDisplayName } from '@/lib/auth'

// =============================================================================
// Sign Up Form Data
// =============================================================================

interface SignUpFormData {
  displayName: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
}

interface FormErrors {
  displayName?: string
  email?: string
  password?: string
  confirmPassword?: string
  acceptedTerms?: string
  general?: string
}

// =============================================================================
// Sign Up Page Component
// =============================================================================

export default function SignUpPage() {
  return (
    <UnauthenticatedGuard fallback={<SignUpRedirect />}>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
        <div className="w-full max-w-md">
          <SignUpForm />
          
          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Bereits ein Konto?{' '}
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                Jetzt anmelden
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
// Sign Up Form Component
// =============================================================================

const SignUpForm: React.FC = () => {
  const router = useRouter()
  const { signUp } = useAuth()
  const { success, error: showError } = useToast()

  const [formData, setFormData] = useState<SignUpFormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    acceptedPrivacy: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Handle form field changes
  const handleChange = (field: keyof SignUpFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field.includes('accepted') ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Display name validation
    const displayNameError = validateDisplayName(formData.displayName)
    if (displayNameError) {
      newErrors.displayName = displayNameError
    }

    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    // Password validation
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwort-Bestätigung ist erforderlich'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    // Terms acceptance validation
    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      newErrors.acceptedTerms = 'Sie müssen den Nutzungsbedingungen und der Datenschutzerklärung zustimmen'
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
      const result = await signUp({
        displayName: formData.displayName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        acceptedTerms: formData.acceptedTerms
      })

      if (result.success) {
        success(
          'Registrierung erfolgreich!', 
          'Bitte bestätigen Sie Ihre E-Mail-Adresse.'
        )
        router.push('/auth/verify-email')
      } else {
        setErrors({ general: result.error })
      }
    } catch (err) {
      setErrors({ general: 'Ein unerwarteter Fehler ist aufgetreten' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <CardTitle>Registrieren</CardTitle>
        <CardDescription>
          Erstellen Sie Ihr MyClub-Konto
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

          {/* Display Name Field */}
          <Input
            label="Vollständiger Name"
            type="text"
            placeholder="Max Mustermann"
            value={formData.displayName}
            onChange={handleChange('displayName')}
            error={errors.displayName}
            required
            autoComplete="name"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Email Field */}
          <Input
            label="E-Mail-Adresse"
            type="email"
            placeholder="ihre.email@beispiel.de"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          {/* Password Field */}
          <Input
            label="Passwort"
            type="password"
            placeholder="Mindestens 8 Zeichen"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
            autoComplete="new-password"
            helperText="Mindestens 8 Zeichen mit Groß-/Kleinbuchstaben und Zahlen"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          {/* Confirm Password Field */}
          <Input
            label="Passwort bestätigen"
            type="password"
            placeholder="Passwort wiederholen"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Terms & Privacy Acceptance */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange('acceptedTerms')}
                className="mt-1 rounded border-border focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <label htmlFor="acceptedTerms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Ich stimme den{' '}
                <Link 
                  href="/terms" 
                  className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  Nutzungsbedingungen
                </Link>
                {' '}zu.
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptedPrivacy"
                checked={formData.acceptedPrivacy}
                onChange={handleChange('acceptedPrivacy')}
                className="mt-1 rounded border-border focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <label htmlFor="acceptedPrivacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Ich stimme der{' '}
                <Link 
                  href="/privacy" 
                  className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  Datenschutzerklärung
                </Link>
                {' '}zu.
              </label>
            </div>

            {errors.acceptedTerms && (
              <p className="text-sm text-destructive">{errors.acceptedTerms}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            loadingText="Registrierung läuft..."
          >
            Konto erstellen
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// =============================================================================
// Sign Up Redirect Component (for authenticated users)
// =============================================================================

const SignUpRedirect: React.FC = () => {
  const router = useRouter()

  React.useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Sie sind bereits angemeldet. Weiterleitung...</p>
      </div>
    </div>
  )
}