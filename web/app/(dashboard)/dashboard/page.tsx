/**
 * Dashboard Overview Page
 * Main dashboard with statistics and quick actions
 */

'use client'

import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'

// =============================================================================
// Dashboard Overview Component
// =============================================================================

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container-padding py-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Willkommen zurück{user?.displayName ? `, ${user.displayName}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Hier ist eine Übersicht über Ihre Vereinsaktivitäten.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vereine"
          value="2"
          description="Aktive Mitgliedschaften"
          icon={<BuildingIcon className="h-8 w-8" />}
          trend={{ value: '+1', label: 'seit letztem Monat' }}
        />
        <StatCard
          title="Teams"
          value="5"
          description="Zugewiesene Teams"
          icon={<UsersIcon className="h-8 w-8" />}
          trend={{ value: '+2', label: 'neue Teams' }}
        />
        <StatCard
          title="Spiele"
          value="12"
          description="Kommende Spiele"
          icon={<TrophyIcon className="h-8 w-8" />}
          trend={{ value: '3', label: 'diese Woche' }}
        />
        <StatCard
          title="Spieler"
          value="48"
          description="Verwaltete Spieler"
          icon={<UserIcon className="h-8 w-8" />}
          trend={{ value: '+4', label: 'neue Anmeldungen' }}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>
              Ihre neuesten Vereinsaktivitäten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="FC Beispiel vs. SV Musterhausen"
                description="Spiel heute um 19:00 Uhr"
                time="vor 2 Stunden"
                type="match"
              />
              <ActivityItem
                title="Max Mustermann dem Team hinzugefügt"
                description="U17 Jugendmannschaft"
                time="vor 5 Stunden"
                type="player"
              />
              <ActivityItem
                title="Trainingsplan aktualisiert"
                description="Neue Termine für diese Woche"
                time="gestern"
                type="training"
              />
              <ActivityItem
                title="Vereinssitzung geplant"
                description="Nächsten Montag um 19:00 Uhr"
                time="vor 2 Tagen"
                type="meeting"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
            <CardDescription>
              Häufig verwendete Aktionen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" fullWidth className="justify-start">
                <PlusIcon className="h-4 w-4 mr-2" />
                Neuen Spieler hinzufügen
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Spiel planen
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <ClipboardIcon className="h-4 w-4 mr-2" />
                Trainingsbericht erstellen
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <ChartIcon className="h-4 w-4 mr-2" />
                Statistiken anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Games */}
      <Card>
        <CardHeader>
          <CardTitle>Kommende Spiele</CardTitle>
          <CardDescription>
            Ihre nächsten Spiele und Trainings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <GameItem
              homeTeam="FC Beispiel U17"
              awayTeam="SV Musterhausen U17"
              date="2024-01-15"
              time="19:00"
              venue="Sportplatz Musterstadt"
              isHome={true}
            />
            <GameItem
              homeTeam="VfB Teststadt"
              awayTeam="FC Beispiel Senioren"
              date="2024-01-18"
              time="15:30"
              venue="Stadion Teststadt"
              isHome={false}
            />
            <GameItem
              homeTeam="FC Beispiel U15"
              awayTeam="FC Demoville U15"
              date="2024-01-20"
              time="10:00"
              venue="Sportplatz Musterstadt"
              isHome={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// Stat Card Component
// =============================================================================

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    label: string
    type?: 'positive' | 'negative' | 'neutral'
  }
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend && (
              <div className="text-xs">
                <span className="font-medium text-success">{trend.value}</span>
                <span className="text-muted-foreground"> {trend.label}</span>
              </div>
            )}
          </div>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// Activity Item Component
// =============================================================================

interface ActivityItemProps {
  title: string
  description: string
  time: string
  type: 'match' | 'player' | 'training' | 'meeting'
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'match':
        return <TrophyIcon className="h-4 w-4 text-primary" />
      case 'player':
        return <UserIcon className="h-4 w-4 text-success" />
      case 'training':
        return <ClipboardIcon className="h-4 w-4 text-warning" />
      case 'meeting':
        return <CalendarIcon className="h-4 w-4 text-info" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        {time}
      </div>
    </div>
  )
}

// =============================================================================
// Game Item Component
// =============================================================================

interface GameItemProps {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  isHome: boolean
}

const GameItem: React.FC<GameItemProps> = ({ homeTeam, awayTeam, date, time, venue, isHome }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    })
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center space-x-4">
        <div className="text-center min-w-[60px]">
          <p className="text-sm font-medium">{formatDate(date)}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-medium ${isHome ? 'text-foreground' : 'text-muted-foreground'}`}>
            {homeTeam}
          </span>
          <span className="text-muted-foreground text-sm">vs</span>
          <span className={`text-sm font-medium ${!isHome ? 'text-foreground' : 'text-muted-foreground'}`}>
            {awayTeam}
          </span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPinIcon className="h-3 w-3 mr-1" />
          {venue}
        </div>
        {isHome && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
            Heimspiel
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Icons
// =============================================================================

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)