/**
 * Club Management Service
 * Multi-tenant club operations with type safety and proper permissions
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  type DocumentSnapshot,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

import { firebaseDb, firebaseFunctions } from '../firebase'
import type { 
  Club, 
  Team, 
  Player, 
  ClubMembership, 
  CreateInput, 
  UpdateInput,
  User
} from '../../../shared/types'
import { FIREBASE_CONFIG, PERMISSIONS, USER_ROLES } from '../../../shared/constants'
import { createEntity, updateEntity, generateId } from '../../../shared/utils'

// =============================================================================
// Service Types
// =============================================================================

export interface ClubQuery {
  page?: number
  limit?: number
  search?: string
  isPublic?: boolean
  features?: string[]
}

export interface ClubResult {
  clubs: Club[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface ServiceResult<T> {
  success: boolean
  data?: T
  error?: string
}

// =============================================================================
// Club Service Class
// =============================================================================

export class ClubService {
  /**
   * Create a new club using Cloud Function
   */
  static async createClub(
    clubData: Omit<CreateInput<Club>, 'createdBy' | 'updatedBy' | 'stats' | 'settings' | 'subscription'>
  ): Promise<ServiceResult<{ clubId: string; slug: string }>> {
    try {
      const createClubFunction = httpsCallable(firebaseFunctions, 'createClub')
      const result = await createClubFunction(clubData)
      
      return {
        success: true,
        data: result.data as { clubId: string; slug: string }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to create club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get club by ID
   */
  static async getClubById(clubId: string): Promise<ServiceResult<Club>> {
    try {
      const clubRef = doc(firebaseDb, FIREBASE_CONFIG.collections.CLUBS, clubId)
      const clubSnap = await getDoc(clubRef)

      if (!clubSnap.exists()) {
        return {
          success: false,
          error: 'Club not found'
        }
      }

      const club = ClubService.mapClubFromFirestore(clubSnap)
      return {
        success: true,
        data: club
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get club by slug
   */
  static async getClubBySlug(slug: string): Promise<ServiceResult<Club>> {
    try {
      const clubsRef = collection(firebaseDb, FIREBASE_CONFIG.collections.CLUBS)
      const q = query(clubsRef, where('slug', '==', slug), limit(1))
      const querySnap = await getDocs(q)

      if (querySnap.empty) {
        return {
          success: false,
          error: 'Club not found'
        }
      }

      const club = ClubService.mapClubFromFirestore(querySnap.docs[0]!)
      return {
        success: true,
        data: club
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Search and list clubs with pagination
   */
  static async searchClubs(params: ClubQuery = {}): Promise<ServiceResult<ClubResult>> {
    try {
      const {
        page = 1,
        limit: pageLimit = 20,
        search,
        isPublic,
        features
      } = params

      let clubsQuery = query(
        collection(firebaseDb, FIREBASE_CONFIG.collections.CLUBS),
        orderBy('createdAt', 'desc')
      )

      // Apply filters
      if (isPublic !== undefined) {
        clubsQuery = query(clubsQuery, where('settings.isPublic', '==', isPublic))
      }

      if (features && features.length > 0) {
        clubsQuery = query(clubsQuery, where('settings.features', 'array-contains-any', features))
      }

      // Apply pagination
      clubsQuery = query(clubsQuery, limit(pageLimit + 1)) // +1 to check if there are more

      const querySnap = await getDocs(clubsQuery)
      const clubs = querySnap.docs
        .slice(0, pageLimit) // Remove the extra document
        .map(doc => ClubService.mapClubFromFirestore(doc))

      // Filter by search term (client-side for now)
      let filteredClubs = clubs
      if (search) {
        const searchLower = search.toLowerCase()
        filteredClubs = clubs.filter(club =>
          club.name.toLowerCase().includes(searchLower) ||
          club.description?.toLowerCase().includes(searchLower) ||
          club.slug.toLowerCase().includes(searchLower)
        )
      }

      return {
        success: true,
        data: {
          clubs: filteredClubs,
          total: filteredClubs.length,
          hasMore: querySnap.docs.length > pageLimit,
          nextCursor: querySnap.docs.length > pageLimit ? 
            querySnap.docs[pageLimit - 1]?.id : undefined
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to search clubs: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Update club information
   */
  static async updateClub(
    clubId: string,
    updates: UpdateInput<Club>
  ): Promise<ServiceResult<void>> {
    try {
      const clubRef = doc(firebaseDb, FIREBASE_CONFIG.collections.CLUBS, clubId)
      
      await updateDoc(clubRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        version: updates.version ? updates.version + 1 : 1
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Delete club (soft delete by updating status)
   */
  static async deleteClub(clubId: string): Promise<ServiceResult<void>> {
    try {
      const clubRef = doc(firebaseDb, FIREBASE_CONFIG.collections.CLUBS, clubId)
      
      await updateDoc(clubRef, {
        status: 'deleted',
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Join a club using Cloud Function
   */
  static async joinClub(
    clubId: string,
    role: 'player' | 'coach' | 'parent' | 'supporter'
  ): Promise<ServiceResult<{ status: string; requiresApproval: boolean }>> {
    try {
      const joinClubFunction = httpsCallable(firebaseFunctions, 'joinClub')
      const result = await joinClubFunction({ clubId, role })
      
      return {
        success: true,
        data: result.data as { status: string; requiresApproval: boolean }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to join club: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get club members with their roles
   */
  static async getClubMembers(clubId: string): Promise<ServiceResult<ClubMembership[]>> {
    try {
      const membersRef = collection(
        firebaseDb,
        FIREBASE_CONFIG.collections.CLUBS,
        clubId,
        'members'
      )
      const membersQuery = query(membersRef, orderBy('joinedAt', 'desc'))
      const membersSnap = await getDocs(membersQuery)

      const members = membersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toDate?.() || new Date(),
        approvedAt: doc.data().approvedAt?.toDate?.(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
      })) as ClubMembership[]

      return {
        success: true,
        data: members
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get club members: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get club teams
   */
  static async getClubTeams(clubId: string): Promise<ServiceResult<Team[]>> {
    try {
      const teamsRef = collection(firebaseDb, FIREBASE_CONFIG.collections.TEAMS)
      const teamsQuery = query(
        teamsRef,
        where('clubId', '==', clubId),
        orderBy('createdAt', 'desc')
      )
      const teamsSnap = await getDocs(teamsQuery)

      const teams = teamsSnap.docs.map(doc => ClubService.mapTeamFromFirestore(doc))

      return {
        success: true,
        data: teams
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get club teams: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Create a new team in the club
   */
  static async createTeam(
    clubId: string,
    teamData: Omit<CreateInput<Team>, 'clubId' | 'createdBy' | 'updatedBy' | 'players' | 'stats'>
  ): Promise<ServiceResult<string>> {
    try {
      const teamsRef = collection(firebaseDb, FIREBASE_CONFIG.collections.TEAMS)
      
      const team = createEntity<Team>({
        ...teamData,
        clubId,
        players: [],
        stats: {
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          currentStreak: { type: 'win', count: 0 }
        }
      } as CreateInput<Team>)

      const docRef = await addDoc(teamsRef, {
        ...team,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return {
        success: true,
        data: docRef.id
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to create team: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Update member role and permissions
   */
  static async updateMemberRole(
    clubId: string,
    userId: string,
    role: string,
    permissions?: string[]
  ): Promise<ServiceResult<void>> {
    try {
      const updateUserRoleFunction = httpsCallable(firebaseFunctions, 'updateUserRole')
      await updateUserRoleFunction({ userId, clubId, role, permissions })
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update member role: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Check if user has permission in club
   */
  static async hasClubPermission(
    user: User,
    clubId: string,
    permission: string
  ): Promise<boolean> {
    const clubRole = user.roles.find(role => role.clubId === clubId)
    return clubRole?.permissions.includes(permission) || false
  }

  // =============================================================================
  // Private Helper Methods
  // =============================================================================

  /**
   * Map Firestore document to Club type
   */
  private static mapClubFromFirestore(doc: QueryDocumentSnapshot | DocumentSnapshot): Club {
    const data = doc.data()!
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      subscription: {
        ...data.subscription,
        expiresAt: data.subscription?.expiresAt?.toDate?.() || new Date()
      }
    } as Club
  }

  /**
   * Map Firestore document to Team type
   */
  private static mapTeamFromFirestore(doc: QueryDocumentSnapshot | DocumentSnapshot): Team {
    const data = doc.data()!
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      coach: {
        ...data.coach,
        assignedAt: data.coach?.assignedAt?.toDate?.() || new Date()
      }
    } as Team
  }
}

// =============================================================================
// Multi-Tenant Utilities
// =============================================================================

/**
 * Verify user has access to club resources
 */
export const verifyClubAccess = async (
  user: User,
  clubId: string,
  requiredPermission?: string
): Promise<boolean> => {
  // Check if user is member of the club
  const isMember = user.clubMemberships.some(
    membership => membership.clubId === clubId && membership.status === 'active'
  )

  if (!isMember) {
    return false
  }

  // Check specific permission if required
  if (requiredPermission) {
    return ClubService.hasClubPermission(user, clubId, requiredPermission)
  }

  return true
}

/**
 * Get user's clubs with their roles
 */
export const getUserClubs = async (user: User): Promise<ServiceResult<Club[]>> => {
  try {
    const clubIds = user.clubMemberships
      .filter(membership => membership.status === 'active')
      .map(membership => membership.clubId)

    if (clubIds.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // Get clubs in batches (Firestore 'in' query limit is 10)
    const clubs: Club[] = []
    const batchSize = 10
    
    for (let i = 0; i < clubIds.length; i += batchSize) {
      const batch = clubIds.slice(i, i + batchSize)
      const clubsRef = collection(firebaseDb, FIREBASE_CONFIG.collections.CLUBS)
      const clubsQuery = query(clubsRef, where('__name__', 'in', batch))
      const clubsSnap = await getDocs(clubsQuery)
      
      clubs.push(...clubsSnap.docs.map(doc => ClubService.mapClubFromFirestore(doc)))
    }

    return {
      success: true,
      data: clubs
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to get user clubs: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export default ClubService