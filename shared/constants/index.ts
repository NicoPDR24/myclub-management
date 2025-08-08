/**
 * Application Constants
 * Centralized constant definitions for the MyClub platform
 */

// =============================================================================
// Application Configuration
// =============================================================================

export const APP_CONFIG = {
  name: 'MyClub Management',
  version: '1.0.0',
  description: 'Modern football club management platform',
  author: 'NicoPDR24',
  repository: 'https://github.com/NicoPDR24/myclub-management'
} as const

// =============================================================================
// Firebase Configuration
// =============================================================================

export const FIREBASE_CONFIG = {
  collections: {
    USERS: 'users',
    CLUBS: 'clubs',
    TEAMS: 'teams',
    PLAYERS: 'players',
    MATCHES: 'matches',
    COMPETITIONS: 'competitions',
    VENUES: 'venues'
  },
  subcollections: {
    TEAM_PLAYERS: 'players',
    CLUB_TEAMS: 'teams',
    MATCH_EVENTS: 'events'
  },
  functions: {
    CREATE_CLUB: 'createClub',
    JOIN_CLUB: 'joinClub',
    UPDATE_USER_ROLE: 'updateUserRole',
    CALCULATE_TEAM_STATS: 'calculateTeamStats'
  }
} as const

// =============================================================================
// User & Role Constants
// =============================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  COACH: 'coach',
  PLAYER: 'player',
  PARENT: 'parent',
  SUPPORTER: 'supporter'
} as const

export const ROLE_HIERARCHY: Record<string, number> = {
  [USER_ROLES.ADMIN]: 100,
  [USER_ROLES.MANAGER]: 80,
  [USER_ROLES.COACH]: 60,
  [USER_ROLES.PLAYER]: 40,
  [USER_ROLES.PARENT]: 20,
  [USER_ROLES.SUPPORTER]: 10
} as const

export const PERMISSIONS = {
  CLUB_READ: 'club:read',
  CLUB_WRITE: 'club:write',
  TEAM_READ: 'team:read',
  TEAM_WRITE: 'team:write',
  PLAYER_READ: 'player:read',
  PLAYER_WRITE: 'player:write',
  MATCH_READ: 'match:read',
  MATCH_WRITE: 'match:write',
  FINANCE_READ: 'finance:read',
  FINANCE_WRITE: 'finance:write'
} as const

// =============================================================================
// Team & Player Constants
// =============================================================================

export const TEAM_CATEGORIES = {
  MEN_SENIOR: 'men_senior',
  WOMEN_SENIOR: 'women_senior',
  YOUTH_U19: 'youth_u19',
  YOUTH_U17: 'youth_u17',
  YOUTH_U15: 'youth_u15',
  YOUTH_U13: 'youth_u13',
  YOUTH_U11: 'youth_u11',
  YOUTH_U9: 'youth_u9',
  YOUTH_U7: 'youth_u7'
} as const

export const PLAYER_POSITIONS = {
  GOALKEEPER: 'goalkeeper',
  DEFENDER: 'defender',
  MIDFIELDER: 'midfielder',
  FORWARD: 'forward',
  SUBSTITUTE: 'substitute'
} as const

export const FORMATION_PRESETS = [
  '4-4-2',
  '4-3-3',
  '3-5-2',
  '4-2-3-1',
  '5-3-2',
  '4-5-1',
  '3-4-3'
] as const

// =============================================================================
// Match & Competition Constants
// =============================================================================

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  HALFTIME: 'halftime',
  FINISHED: 'finished',
  POSTPONED: 'postponed',
  CANCELLED: 'cancelled'
} as const

export const MATCH_EVENT_TYPES = {
  GOAL: 'goal',
  YELLOW_CARD: 'yellow_card',
  RED_CARD: 'red_card',
  SUBSTITUTION: 'substitution',
  INJURY: 'injury',
  OTHER: 'other'
} as const

export const COMPETITION_TYPES = {
  LEAGUE: 'league',
  CUP: 'cup',
  FRIENDLY: 'friendly',
  TOURNAMENT: 'tournament'
} as const

// =============================================================================
// Subscription & Features
// =============================================================================

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const

export const CLUB_FEATURES = {
  TEAMS: 'teams',
  MATCHES: 'matches',
  TRAINING: 'training',
  FINANCE: 'finance',
  COMMUNICATION: 'communication',
  STATISTICS: 'statistics',
  EVENTS: 'events'
} as const

export const FEATURE_LIMITS: Record<string, Record<string, number | null>> = {
  [SUBSCRIPTION_PLANS.FREE]: {
    teams: 1,
    players: 25,
    matches: 50,
    storage: 100 // MB
  },
  [SUBSCRIPTION_PLANS.BASIC]: {
    teams: 3,
    players: 75,
    matches: 200,
    storage: 500
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    teams: 10,
    players: 300,
    matches: 1000,
    storage: 2000
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    teams: null, // unlimited
    players: null,
    matches: null,
    storage: null
  }
} as const

// =============================================================================
// Validation Constants
// =============================================================================

export const VALIDATION_RULES = {
  club: {
    name: { minLength: 2, maxLength: 100 },
    slug: { minLength: 3, maxLength: 50, pattern: /^[a-z0-9-]+$/ },
    description: { maxLength: 500 }
  },
  team: {
    name: { minLength: 2, maxLength: 50 },
    season: { pattern: /^\d{4}-\d{4}$/ }
  },
  player: {
    firstName: { minLength: 1, maxLength: 50 },
    lastName: { minLength: 1, maxLength: 50 },
    jerseyNumber: { min: 1, max: 99 }
  },
  user: {
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    displayName: { minLength: 2, maxLength: 50 }
  }
} as const

// =============================================================================
// UI Constants
// =============================================================================

export const THEME_COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  secondary: {
    500: '#10b981',
    600: '#059669',
    700: '#047857'
  },
  accent: {
    500: '#f59e0b',
    600: '#d97706'
  },
  error: {
    500: '#ef4444',
    600: '#dc2626'
  },
  success: {
    500: '#22c55e',
    600: '#16a34a'
  }
} as const

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// =============================================================================
// Date & Time Constants
// =============================================================================

export const DATE_FORMATS = {
  SHORT: 'dd.MM.yyyy',
  LONG: 'dd. MMMM yyyy',
  WITH_TIME: 'dd.MM.yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss"
} as const

export const TIMEZONE_DEFAULT = 'Europe/Berlin'

// =============================================================================
// Error Messages
// =============================================================================

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network connection error',
  CLUB_NOT_FOUND: 'Club not found',
  TEAM_NOT_FOUND: 'Team not found',
  PLAYER_NOT_FOUND: 'Player not found',
  MATCH_NOT_FOUND: 'Match not found'
} as const

// =============================================================================
// Cache Keys
// =============================================================================

export const CACHE_KEYS = {
  USER_PROFILE: (uid: string) => `user:${uid}`,
  CLUB_DATA: (clubId: string) => `club:${clubId}`,
  TEAM_DATA: (teamId: string) => `team:${teamId}`,
  TEAM_STATS: (teamId: string) => `team:${teamId}:stats`,
  MATCH_DATA: (matchId: string) => `match:${matchId}`,
  CLUB_TEAMS: (clubId: string) => `club:${clubId}:teams`,
  TEAM_PLAYERS: (teamId: string) => `team:${teamId}:players`
} as const

export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60 // 24 hours
} as const