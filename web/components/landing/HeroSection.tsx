/**
 * Hero Section Component
 * Landing page hero with call-to-action
 */

import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui'

// =============================================================================
// Hero Section Component
// =============================================================================

export const HeroSection: React.FC = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/20">
      <div className="container-padding mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient">
              Moderne Vereinsverwaltung für Fußballvereine
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Verwalten Sie Teams, Spieler, Spiele und mehr in einer einzigen, 
              benutzerfreundlichen Plattform. Mit modernster Technologie und 
              mobiler App.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/auth/signup" className="flex-1">
              <Button size="lg" fullWidth>
                Kostenlos starten
              </Button>
            </Link>
            <Link href="#features" className="flex-1">
              <Button variant="outline" size="lg" fullWidth>
                Features ansehen
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-6">
              Vertraut von Vereinen in ganz Deutschland
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-xs text-muted-foreground">Vereine</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2.5k+</div>
                <div className="text-xs text-muted-foreground">Spieler</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-xs text-muted-foreground">Spiele</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection