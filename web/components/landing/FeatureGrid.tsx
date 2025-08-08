/**
 * Feature Grid Component
 * Displays key features of the platform
 */

import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

// =============================================================================
// Features Data
// =============================================================================

const features = [
  {
    icon: <UsersIcon className="h-8 w-8 text-primary" />,
    title: 'Team Management',
    description: 'Verwalten Sie mehrere Teams mit Spielerlisten, Positionen und Statistiken.',
    benefits: ['Spielerdaten', 'Positionsverwaltung', 'Team-Statistiken']
  },
  {
    icon: <CalendarIcon className="h-8 w-8 text-primary" />,
    title: 'Spielplanung',
    description: 'Planen und verwalten Sie Spiele, Trainings und Turniere einfach.',
    benefits: ['Spielkalender', 'Trainingstermine', 'Turnierverwaltung']
  },
  {
    icon: <ChartIcon className="h-8 w-8 text-primary" />,
    title: 'Statistiken',
    description: 'Detaillierte Analysen und Statistiken für Teams und Spieler.',
    benefits: ['Leistungsanalyse', 'Trenddiagramme', 'Vergleiche']
  },
  {
    icon: <MobileIcon className="h-8 w-8 text-primary" />,
    title: 'Mobile App',
    description: 'Vollwertige mobile App für iOS und Android mit Offline-Funktionen.',
    benefits: ['Native Apps', 'Offline-Modus', 'Push-Notifications']
  },
  {
    icon: <CloudIcon className="h-8 w-8 text-primary" />,
    title: 'Cloud-Backup',
    description: 'Automatische Datensicherung und Synchronisation zwischen Geräten.',
    benefits: ['Auto-Backup', 'Geräte-Sync', 'Datenwiederherstellung']
  },
  {
    icon: <ShieldIcon className="h-8 w-8 text-primary" />,
    title: 'Datenschutz',
    description: 'DSGVO-konforme Datenverwaltung mit höchsten Sicherheitsstandards.',
    benefits: ['DSGVO-konform', 'Verschlüsselung', 'Sichere Server']
  }
] as const

// =============================================================================
// Feature Grid Component
// =============================================================================

export const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  )
}

// =============================================================================
// Feature Card Component
// =============================================================================

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  benefits: readonly string[]
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, benefits }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <CheckIcon className="h-4 w-4 text-success mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// Icons
// =============================================================================

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const MobileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
  </svg>
)

const CloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default FeatureGrid