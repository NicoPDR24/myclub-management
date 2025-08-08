/**
 * Firebase Cloud Functions
 * Modern Firebase Functions with TypeScript and proper error handling
 */

import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https'
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { logger } from 'firebase-functions'
import { z } from 'zod'
import type { 
  Club, 
  Team, 
  Player, 
  User, 
  ClubMembership, 
  TeamStats,
  CreateInput 
} from '../../shared/types'
import { FIREBASE_CONFIG, USER_ROLES, PERMISSIONS } from '../../shared/constants'

// =============================================================================
// Initialize Firebase Admin
// =============================================================================

const app = initializeApp()
const db = getFirestore(app)

// =============================================================================
// Validation Schemas
// =============================================================================

const createClubSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string().optional()
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional()
  })
})

const joinClubSchema = z.object({
  clubId: z.string(),
  role: z.enum(['player', 'coach', 'parent', 'supporter'])
})

const updateUserRoleSchema = z.object({
  userId: z.string(),
  clubId: z.string(),
  role: z.enum(['admin', 'manager', 'coach', 'player', 'parent', 'supporter']),
  permissions: z.array(z.string()).optional()
})

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get authenticated user context
 */
const getAuthContext = (context: any) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required')
  }
  
  return {
    uid: context.auth.uid,
    email: context.auth.token.email,
    emailVerified: context.auth.token.email_verified
  }
}

/**
 * Check if user has permission for club
 */
const hasClubPermission = async (
  userId: string, 
  clubId: string, 
  requiredRole: string = 'member'
): Promise<boolean> => {
  try {
    const membershipDoc = await db
      .collection(FIREBASE_CONFIG.collections.CLUBS)
      .doc(clubId)
      .collection('members')
      .doc(userId)
      .get()
    
    if (!membershipDoc.exists) {
      return false
    }
    
    const membership = membershipDoc.data() as ClubMembership
    return membership.status === 'active'
  } catch (error) {
    logger.error('Error checking club permission:', error)
    return false
  }
}

/**
 * Generate unique slug for club
 */
const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = await db
      .collection(FIREBASE_CONFIG.collections.CLUBS)
      .where('slug', '==', slug)
      .limit(1)
      .get()
    
    if (existing.empty) {
      return slug
    }
    
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// =============================================================================
// Club Management Functions
// =============================================================================

/**
 * Create a new club
 */
export const createClub = onCall(
  { cors: true, region: 'europe-west1' },
  async (request) => {
    try {
      const auth = getAuthContext(request)
      const data = createClubSchema.parse(request.data)
      
      logger.info('Creating club', { userId: auth.uid, clubName: data.name })
      
      // Generate unique slug
      const slug = await generateUniqueSlug(data.slug)
      
      // Create club document
      const clubRef = db.collection(FIREBASE_CONFIG.collections.CLUBS).doc()
      const now = new Date()
      
      const clubData: CreateInput<Club> = {
        ...data,
        slug,
        settings: {
          isPublic: false,
          allowRegistration: false,
          requireApproval: true,
          features: ['teams', 'matches']
        },
        subscription: {
          plan: 'free',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          features: ['teams', 'matches']
        },
        stats: {
          memberCount: 1,
          teamCount: 0,
          matchCount: 0,
          activeSeasons: []
        },
        createdBy: auth.uid,
        updatedBy: auth.uid,
        createdAt: now,
        updatedAt: now,
        version: 1
      }
      
      // Use batch write for atomicity
      const batch = db.batch()
      
      // Create club
      batch.set(clubRef, clubData)
      
      // Add creator as admin member
      const membershipRef = clubRef.collection('members').doc(auth.uid)
      const membershipData: CreateInput<ClubMembership> = {
        clubId: clubRef.id,
        userId: auth.uid,
        status: 'active',
        joinedAt: now,
        approvedBy: auth.uid,
        approvedAt: now,
        createdAt: now,
        updatedAt: now,
        version: 1
      }
      batch.set(membershipRef, membershipData)
      
      // Update user with club membership
      const userRef = db.collection(FIREBASE_CONFIG.collections.USERS).doc(auth.uid)
      batch.update(userRef, {
        clubMemberships: db.FieldValue.arrayUnion({
          clubId: clubRef.id,
          role: USER_ROLES.ADMIN,
          joinedAt: now
        }),
        updatedAt: now
      })
      
      await batch.commit()
      
      logger.info('Club created successfully', { 
        clubId: clubRef.id, 
        slug,
        userId: auth.uid 
      })
      
      return {
        success: true,
        clubId: clubRef.id,
        slug
      }
      
    } catch (error) {
      logger.error('Error creating club:', error)
      
      if (error instanceof z.ZodError) {
        throw new HttpsError('invalid-argument', 'Validation failed', error.errors)
      }
      
      throw new HttpsError('internal', 'Failed to create club')
    }
  }
)

/**
 * Join a club
 */
export const joinClub = onCall(
  { cors: true, region: 'europe-west1' },
  async (request) => {
    try {
      const auth = getAuthContext(request)
      const data = joinClubSchema.parse(request.data)
      
      logger.info('User joining club', { 
        userId: auth.uid, 
        clubId: data.clubId,
        role: data.role 
      })
      
      // Check if club exists and allows registration
      const clubDoc = await db
        .collection(FIREBASE_CONFIG.collections.CLUBS)
        .doc(data.clubId)
        .get()
      
      if (!clubDoc.exists) {
        throw new HttpsError('not-found', 'Club not found')
      }
      
      const club = clubDoc.data() as Club
      
      if (!club.settings.allowRegistration) {
        throw new HttpsError('permission-denied', 'Club registration is closed')
      }
      
      // Check if user is already a member
      const existingMembership = await db
        .collection(FIREBASE_CONFIG.collections.CLUBS)
        .doc(data.clubId)
        .collection('members')
        .doc(auth.uid)
        .get()
      
      if (existingMembership.exists) {
        throw new HttpsError('already-exists', 'Already a member of this club')
      }
      
      const now = new Date()
      const requiresApproval = club.settings.requireApproval
      
      // Create membership
      const membershipData: CreateInput<ClubMembership> = {
        clubId: data.clubId,
        userId: auth.uid,
        status: requiresApproval ? 'pending' : 'active',
        joinedAt: now,
        ...(requiresApproval ? {} : { approvedAt: now }),
        createdAt: now,
        updatedAt: now,
        version: 1
      }
      
      await db
        .collection(FIREBASE_CONFIG.collections.CLUBS)
        .doc(data.clubId)
        .collection('members')
        .doc(auth.uid)
        .set(membershipData)
      
      // Update club member count
      await db
        .collection(FIREBASE_CONFIG.collections.CLUBS)
        .doc(data.clubId)
        .update({
          'stats.memberCount': db.FieldValue.increment(1),
          updatedAt: now
        })
      
      logger.info('User joined club successfully', {
        userId: auth.uid,
        clubId: data.clubId,
        status: membershipData.status
      })
      
      return {
        success: true,
        status: membershipData.status,
        requiresApproval
      }
      
    } catch (error) {
      logger.error('Error joining club:', error)
      
      if (error instanceof HttpsError) {
        throw error
      }
      
      if (error instanceof z.ZodError) {
        throw new HttpsError('invalid-argument', 'Validation failed', error.errors)
      }
      
      throw new HttpsError('internal', 'Failed to join club')
    }
  }
)

// =============================================================================
// Team Statistics Functions
// =============================================================================

/**
 * Calculate team statistics
 */
export const calculateTeamStats = onCall(
  { cors: true, region: 'europe-west1' },
  async (request) => {
    try {
      const auth = getAuthContext(request)
      const { teamId } = request.data
      
      if (!teamId) {
        throw new HttpsError('invalid-argument', 'Team ID is required')
      }
      
      // Get team document
      const teamDoc = await db
        .collection(FIREBASE_CONFIG.collections.TEAMS)
        .doc(teamId)
        .get()
      
      if (!teamDoc.exists) {
        throw new HttpsError('not-found', 'Team not found')
      }
      
      const team = teamDoc.data() as Team
      
      // Check permissions
      const hasPermission = await hasClubPermission(auth.uid, team.clubId)
      if (!hasPermission) {
        throw new HttpsError('permission-denied', 'No access to this team')
      }
      
      // Get all matches for this team
      const matchesSnapshot = await db
        .collection(FIREBASE_CONFIG.collections.MATCHES)
        .where('homeTeamId', '==', teamId)
        .where('status', '==', 'finished')
        .get()
      
      const awayMatchesSnapshot = await db
        .collection(FIREBASE_CONFIG.collections.MATCHES)
        .where('awayTeamId', '==', teamId)
        .where('status', '==', 'finished')
        .get()
      
      let wins = 0
      let draws = 0
      let losses = 0
      let goalsFor = 0
      let goalsAgainst = 0
      
      // Process home matches
      matchesSnapshot.docs.forEach(doc => {
        const match = doc.data()
        if (match.result) {
          goalsFor += match.result.homeGoals
          goalsAgainst += match.result.awayGoals
          
          if (match.result.homeGoals > match.result.awayGoals) wins++
          else if (match.result.homeGoals === match.result.awayGoals) draws++
          else losses++
        }
      })
      
      // Process away matches
      awayMatchesSnapshot.docs.forEach(doc => {
        const match = doc.data()
        if (match.result) {
          goalsFor += match.result.awayGoals
          goalsAgainst += match.result.homeGoals
          
          if (match.result.awayGoals > match.result.homeGoals) wins++
          else if (match.result.awayGoals === match.result.homeGoals) draws++
          else losses++
        }
      })
      
      const matchesPlayed = wins + draws + losses
      const points = (wins * 3) + draws
      
      const stats: TeamStats = {
        matchesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        points,
        currentStreak: { type: 'win', count: 0 } // TODO: Calculate actual streak
      }
      
      // Update team document with new stats
      await db
        .collection(FIREBASE_CONFIG.collections.TEAMS)
        .doc(teamId)
        .update({
          stats,
          updatedAt: new Date()
        })
      
      logger.info('Team stats calculated', { teamId, stats })
      
      return { success: true, stats }
      
    } catch (error) {
      logger.error('Error calculating team stats:', error)
      
      if (error instanceof HttpsError) {
        throw error
      }
      
      throw new HttpsError('internal', 'Failed to calculate team stats')
    }
  }
)

// =============================================================================
// Firestore Triggers
// =============================================================================

/**
 * Update club stats when team is created
 */
export const onTeamCreated = onDocumentCreated(
  `${FIREBASE_CONFIG.collections.TEAMS}/{teamId}`,
  async (event) => {
    try {
      const team = event.data?.data() as Team
      if (!team) return
      
      await db
        .collection(FIREBASE_CONFIG.collections.CLUBS)
        .doc(team.clubId)
        .update({
          'stats.teamCount': db.FieldValue.increment(1),
          updatedAt: new Date()
        })
      
      logger.info('Club team count updated', { clubId: team.clubId })
    } catch (error) {
      logger.error('Error updating club stats on team creation:', error)
    }
  }
)

/**
 * Update match count when match is completed
 */
export const onMatchCompleted = onDocumentUpdated(
  `${FIREBASE_CONFIG.collections.MATCHES}/{matchId}`,
  async (event) => {
    try {
      const before = event.data?.before.data()
      const after = event.data?.after.data()
      
      if (!before || !after) return
      
      // Check if match was just completed
      if (before.status !== 'finished' && after.status === 'finished') {
        // Update club match count
        const clubIds = [after.homeTeam?.clubId, after.awayTeam?.clubId].filter(Boolean)
        
        for (const clubId of clubIds) {
          await db
            .collection(FIREBASE_CONFIG.collections.CLUBS)
            .doc(clubId)
            .update({
              'stats.matchCount': db.FieldValue.increment(1),
              updatedAt: new Date()
            })
        }
        
        logger.info('Club match counts updated', { matchId: event.params?.matchId })
      }
    } catch (error) {
      logger.error('Error updating match count:', error)
    }
  }
)

// =============================================================================
// Health Check Endpoint
// =============================================================================

/**
 * Health check endpoint
 */
export const healthCheck = onRequest(
  { cors: true, region: 'europe-west1' },
  (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  }
)