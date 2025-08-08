/**
 * Sign In Page
 * Modern authentication page with form validation and accessibility
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { UnauthenticatedGuard } from '@/components/auth/AuthGuard'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToast } from '@/components/providers/ToastProvider'
import { validateEmail } from '@/lib/auth'
import { cn } from '@/lib/utils'

// =============================================================================
// Sign In Form Data
// =============================================================================

interface SignInFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

// =============================================================================
// Sign In Page Component
// =============================================================================

export default function SignInPage() {
  return (
    <UnauthenticatedGuard fallback={<SignInRedirect />}>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <SignInForm />
          
          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Noch kein Konto?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                Jetzt registrieren
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
// Sign In Form Component
// =============================================================================

const SignInForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const { success, error: showError } = useToast()

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  // Handle form field changes
  const handleChange = (field: keyof SignInFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein'
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
      const result = await signIn({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      })

      if (result.success) {
        success('Anmeldung erfolgreich', 'Sie werden weitergeleitet...')
        router.push(redirectTo)
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <CardTitle>Anmelden</CardTitle>
        <CardDescription>
          Melden Sie sich in Ihrem MyClub-Konto an
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
            placeholder="Ihr Passwort"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
            autoComplete="current-password"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange('rememberMe')}
                className="rounded border-border focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <span className="text-sm text-muted-foreground">
                Angemeldet bleiben
              </span>
            </label>

            <Link
              href="/auth/reset-password"
              className="text-sm text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            loadingText="Anmeldung läuft..."
          >
            Anmelden
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// =============================================================================
// Sign In Redirect Component (for authenticated users)
// =============================================================================

const SignInRedirect: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const redirectTo = searchParams.get('redirect') || '/dashboard'
    router.push(redirectTo)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Sie sind bereits angemeldet. Weiterleitung...</p>
      </div>
    </div>
  )
}