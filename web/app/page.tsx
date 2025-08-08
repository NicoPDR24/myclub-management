/**
 * Home Page Component
 * Modern landing page with authentication integration
 */

import Link from 'next/link'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardPreview } from '@/components/dashboard/DashboardPreview'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { HeroSection } from '@/components/landing/HeroSection'
import { PricingSection } from '@/components/landing/PricingSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Authenticated users see dashboard */}
      <AuthGuard
        fallback={<PublicHomePage />}
        requireEmailVerification={false}
      >
        <DashboardPreview />
      </AuthGuard>
    </div>
  )
}

/**
 * Public landing page for unauthenticated users
 */
function PublicHomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="glass fixed top-0 z-50 w-full border-b">
        <div className="container-padding mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold">MyClub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="nav-link">
                Features
              </Link>
              <Link href="#pricing" className="nav-link">
                Preise
              </Link>
              <Link href="/auth/signin" className="nav-link">
                Anmelden
              </Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">
                Kostenlos starten
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden btn btn-ghost btn-icon">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="section-padding bg-muted/30">
          <div className="container-padding mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Alles für Ihren Fußballverein
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Moderne Vereinsverwaltung mit Multi-Tenant-Architektur, 
                Firebase-Backend und mobiler App.
              </p>
            </div>
            <FeatureGrid />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section-padding">
          <div className="container-padding mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Faire Preise für jeden Verein
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Wählen Sie den Plan, der zu Ihrem Verein passt. 
                Jederzeit kündbar, keine versteckten Kosten.
              </p>
            </div>
            <PricingSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-padding mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Bereit für die Zukunft?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Starten Sie heute kostenlos und erleben Sie moderne Vereinsverwaltung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn bg-white text-primary hover:bg-white/90 btn-lg">
                Kostenlos registrieren
              </Link>
              <Link href="#features" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary btn-lg">
                Mehr erfahren
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container-padding mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold">MyClub Management</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Die moderne Lösung für Fußballvereine. 
                Verwalten Sie Teams, Spieler, Spiele und mehr in einer einzigen Plattform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Schnellzugriff</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/auth/signup" className="hover:text-primary">Registrieren</Link></li>
                <li><Link href="/auth/signin" className="hover:text-primary">Anmelden</Link></li>
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary">Preise</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Rechtliches</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Datenschutz</Link></li>
                <li><Link href="/terms" className="hover:text-primary">AGB</Link></li>
                <li><Link href="/imprint" className="hover:text-primary">Impressum</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Kontakt</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MyClub Management. Made with ❤️ by NicoPDR24</p>
          </div>
        </div>
      </footer>
    </>
  )
}