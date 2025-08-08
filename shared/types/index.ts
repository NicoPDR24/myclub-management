/**
 * Core Domain Types for MyClub Management Platform
 * Modern TypeScript patterns with strict typing
 */

// =============================================================================
// Base Entity Types
// =============================================================================

export interface BaseEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly version: number
}

export interface BaseAuditableEntity extends BaseEntity {
  readonly createdBy: string
  readonly updatedBy: string
}

// =============================================================================
// User & Authentication Types
// =============================================================================

export interface User extends BaseEntity {
  readonly email: string
  readonly displayName: string
  readonly photoURL?: string
  readonly emailVerified: boolean
  readonly roles: readonly UserRole[]
  readonly clubMemberships: readonly ClubMembership[]
  readonly preferences: UserPreferences
}

export interface UserRole {
  readonly clubId: string
  readonly role: ClubRoleType
  readonly permissions: readonly Permission[]
  readonly assignedBy: string
  readonly assignedAt: Date
}

export type ClubRoleType = 
  | 'admin'
  | 'manager' 
  | 'coach'
  | 'player'
  | 'parent'
  | 'supporter'

export type Permission = 
  | 'club:read'
  | 'club:write'
  | 'team:read'
  | 'team:write'
  | 'player:read'
  | 'player:write'
  | 'match:read'
  | 'match:write'
  | 'finance:read'
  | 'finance:write'

export interface UserPreferences {
  readonly language: string
  readonly timezone: string
  readonly notifications: NotificationSettings
  readonly theme: 'light' | 'dark' | 'auto'
}

export interface NotificationSettings {
  readonly email: boolean
  readonly push: boolean
  readonly matchReminders: boolean
  readonly teamUpdates: boolean
  readonly financialUpdates: boolean
}

// =============================================================================
// Club & Organization Types  
// =============================================================================

export interface Club extends BaseAuditableEntity {
  readonly name: string
  readonly slug: string
  readonly description?: string
  readonly logo?: string
  readonly colors: ClubColors
  readonly address: Address
  readonly contact: ContactInfo
  readonly settings: ClubSettings
  readonly subscription: Subscription
  readonly stats: ClubStats
}

export interface ClubColors {
  readonly primary: string
  readonly secondary: string
  readonly accent?: string
}

export interface Address {
  readonly street: string
  readonly city: string
  readonly postalCode: string
  readonly country: string
  readonly coordinates?: Coordinates
}

export interface Coordinates {
  readonly latitude: number
  readonly longitude: number
}

export interface ContactInfo {
  readonly email: string
  readonly phone?: string
  readonly website?: string
  readonly socialMedia?: Record<string, string>
}

export interface ClubSettings {
  readonly isPublic: boolean
  readonly allowRegistration: boolean
  readonly requireApproval: boolean
  readonly maxMembers?: number
  readonly features: readonly ClubFeature[]
}

export type ClubFeature = 
  | 'teams'
  | 'matches'
  | 'training'
  | 'finance'
  | 'communication'
  | 'statistics'
  | 'events'

export interface Subscription {
  readonly plan: SubscriptionPlan
  readonly status: SubscriptionStatus
  readonly expiresAt: Date
  readonly features: readonly ClubFeature[]
}

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'suspended'

export interface ClubStats {
  readonly memberCount: number
  readonly teamCount: number
  readonly matchCount: number
  readonly activeSeasons: readonly string[]
}

export interface ClubMembership extends BaseEntity {
  readonly clubId: string
  readonly userId: string
  readonly status: MembershipStatus
  readonly joinedAt: Date
  readonly approvedBy?: string
  readonly approvedAt?: Date
}

export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'inactive'

// =============================================================================
// Team & Player Types
// =============================================================================

export interface Team extends BaseAuditableEntity {
  readonly clubId: string
  readonly name: string
  readonly category: TeamCategory
  readonly ageGroup?: AgeGroup
  readonly season: string
  readonly description?: string
  readonly coach: Coach
  readonly players: readonly string[]
  readonly homeVenue?: Venue
  readonly stats: TeamStats
}

export type TeamCategory = 
  | 'men_senior'
  | 'women_senior'
  | 'youth_u19'
  | 'youth_u17'
  | 'youth_u15'
  | 'youth_u13'
  | 'youth_u11'
  | 'youth_u9'
  | 'youth_u7'

export interface AgeGroup {
  readonly minAge: number
  readonly maxAge: number
  readonly birthYearRange: readonly [number, number]
}

export interface Coach {
  readonly userId: string
  readonly licenseLevel?: string
  readonly specializations: readonly string[]
  readonly assignedAt: Date
}

export interface Player extends BaseAuditableEntity {
  readonly clubId: string
  readonly teamId: string
  readonly userId?: string
  readonly jerseyNumber?: number
  readonly position: PlayerPosition
  readonly personalInfo: PlayerPersonalInfo
  readonly parentInfo?: ParentInfo
  readonly medicalInfo?: MedicalInfo
  readonly stats: PlayerStats
}

export type PlayerPosition = 
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward'
  | 'substitute'

export interface PlayerPersonalInfo {
  readonly firstName: string
  readonly lastName: string
  readonly dateOfBirth: Date
  readonly nationality: string
  readonly photo?: string
  readonly height?: number
  readonly weight?: number
}

export interface ParentInfo {
  readonly primaryContact: ContactPerson
  readonly secondaryContact?: ContactPerson
  readonly emergencyContact: ContactPerson
}

export interface ContactPerson {
  readonly name: string
  readonly relationship: string
  readonly email: string
  readonly phone: string
}

export interface MedicalInfo {
  readonly bloodType?: string
  readonly allergies: readonly string[]
  readonly medications: readonly string[]
  readonly conditions: readonly string[]
  readonly emergencyNotes?: string
  readonly lastCheckup?: Date
}

// =============================================================================
// Match & Competition Types
// =============================================================================

export interface Match extends BaseAuditableEntity {
  readonly clubId: string
  readonly homeTeamId: string
  readonly awayTeamId: string
  readonly competition: Competition
  readonly date: Date
  readonly venue: Venue
  readonly status: MatchStatus
  readonly result?: MatchResult
  readonly events: readonly MatchEvent[]
  readonly lineup?: MatchLineup
  readonly stats?: MatchStats
}

export type MatchStatus = 
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'cancelled'

export interface Competition {
  readonly id: string
  readonly name: string
  readonly type: CompetitionType
  readonly season: string
  readonly organizer: string
}

export type CompetitionType = 'league' | 'cup' | 'friendly' | 'tournament'

export interface Venue {
  readonly name: string
  readonly address: Address
  readonly capacity?: number
  readonly facilities: readonly string[]
}

export interface MatchResult {
  readonly homeGoals: number
  readonly awayGoals: number
  readonly homeTeamPenalties?: number
  readonly awayTeamPenalties?: number
  readonly notes?: string
}

export interface MatchEvent {
  readonly id: string
  readonly minute: number
  readonly type: MatchEventType
  readonly playerId?: string
  readonly description: string
}

export type MatchEventType = 
  | 'goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'injury'
  | 'other'

export interface MatchLineup {
  readonly homeTeam: TeamLineup
  readonly awayTeam: TeamLineup
}

export interface TeamLineup {
  readonly formation: string
  readonly players: readonly LineupPlayer[]
  readonly substitutes: readonly LineupPlayer[]
}

export interface LineupPlayer {
  readonly playerId: string
  readonly position: PlayerPosition
  readonly jerseyNumber: number
}

// =============================================================================
// Statistics Types
// =============================================================================

export interface TeamStats {
  readonly matchesPlayed: number
  readonly wins: number
  readonly draws: number
  readonly losses: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly points: number
  readonly currentStreak: StreakInfo
}

export interface PlayerStats {
  readonly matchesPlayed: number
  readonly goals: number
  readonly assists: number
  readonly yellowCards: number
  readonly redCards: number
  readonly minutesPlayed: number
}

export interface MatchStats {
  readonly possession: [number, number]
  readonly shots: [number, number]
  readonly shotsOnTarget: [number, number]
  readonly corners: [number, number]
  readonly fouls: [number, number]
}

export interface StreakInfo {
  readonly type: 'win' | 'draw' | 'loss'
  readonly count: number
}

// =============================================================================
// Utility Types
// =============================================================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type CreateInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'version'>

export type UpdateInput<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'version'>>