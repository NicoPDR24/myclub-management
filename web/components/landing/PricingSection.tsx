/**
 * Pricing Section Component
 * Displays pricing plans for the platform
 */

import React from 'react'
import Link from 'next/link'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@/components/ui'

// =============================================================================
// Pricing Plans Data
// =============================================================================

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfekt für kleine Vereine',
    price: '0',
    period: 'kostenlos',
    features: [
      '1 Team',
      'Bis zu 25 Spieler',
      'Grundlegende Statistiken',
      'Web-Zugang',
      'E-Mail-Support'
    ],
    limitations: [
      'Kein Export',
      'Keine API',
      'Basic Features'
    ],
    cta: 'Kostenlos starten',
    ctaVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'Professional',
    description: 'Für wachsende Vereine',
    price: '19',
    period: 'pro Monat',
    features: [
      'Bis zu 5 Teams',
      'Bis zu 150 Spieler',
      'Erweiterte Statistiken',
      'Mobile App',
      'Datenexport',
      'Prioritäts-Support'
    ],
    limitations: [],
    cta: '30 Tage kostenlos testen',
    ctaVariant: 'default' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Für große Organisationen',
    price: '49',
    period: 'pro Monat',
    features: [
      'Unbegrenzte Teams',
      'Unbegrenzte Spieler',
      'Premium Statistiken',
      'API-Zugang',
      'Benutzerverwaltung',
      'Dedicated Support',
      'Custom Branding'
    ],
    limitations: [],
    cta: 'Kontakt aufnehmen',
    ctaVariant: 'outline' as const,
    popular: false
  }
] as const

// =============================================================================
// Pricing Section Component
// =============================================================================

export const PricingSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {pricingPlans.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </div>
  )
}

// =============================================================================
// Pricing Card Component
// =============================================================================

interface PricingCardProps {
  name: string
  description: string
  price: string
  period: string
  features: readonly string[]
  limitations: readonly string[]
  cta: string
  ctaVariant: 'default' | 'outline'
  popular: boolean
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  description,
  price,
  period,
  features,
  limitations,
  cta,
  ctaVariant,
  popular
}) => {
  return (
    <Card className={`relative h-full ${popular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
            Beliebt
          </span>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="pt-4">
          <div className="text-4xl font-bold">
            €{price}
            <span className="text-lg font-normal text-muted-foreground">
              {price === '0' ? '' : `/${period}`}
            </span>
          </div>
          {price !== '0' && (
            <p className="text-sm text-muted-foreground mt-1">
              {period}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <CheckIcon className="h-4 w-4 text-success mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
          {limitations.map((limitation, index) => (
            <li key={`limitation-${index}`} className="flex items-center text-sm text-muted-foreground">
              <XIcon className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
              {limitation}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link href="/auth/signup" className="w-full">
          <Button variant={ctaVariant} fullWidth>
            {cta}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// =============================================================================
// Icons
// =============================================================================

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default PricingSection