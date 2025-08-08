/**
 * Root Layout Component
 * Modern Next.js 14 App Router layout with proper providers
 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'MyClub Management',
    template: '%s | MyClub Management'
  },
  description: 'Modern football club management platform with multi-tenant architecture',
  keywords: [
    'football',
    'soccer',
    'club management',
    'team management',
    'sports',
    'firebase',
    'multi-tenant'
  ],
  authors: [
    {
      name: 'NicoPDR24',
      url: 'https://github.com/NicoPDR24'
    }
  ],
  creator: 'NicoPDR24',
  publisher: 'MyClub Management',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: process.env.NODE_ENV === 'production',
    googleBot: {
      index: process.env.NODE_ENV === 'production',
      follow: process.env.NODE_ENV === 'production',
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_ID
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">
                  {children}
                </div>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}