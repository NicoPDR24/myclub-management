/**
 * Seed Data Script for Firebase Emulators
 * Populates emulator with test data for development
 */

const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')

// Initialize Firebase Admin SDK for emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'

const app = initializeApp({ projectId: 'demo-myclub-management' })
const auth = getAuth(app)
const db = getFirestore(app)

// =============================================================================
// Seed Data
// =============================================================================

const seedUsers = [
  {
    uid: 'admin-user-1',
    email: 'admin@myclub.de',
    password: 'password123',
    displayName: 'Max Administrator',
    emailVerified: true,
    role: 'admin'
  },
  {
    uid: 'coach-user-1', 
    email: 'trainer@myclub.de',
    password: 'password123',
    displayName: 'Anna Trainerin',
    emailVerified: true,
    role: 'coach'
  },
  {
    uid: 'player-user-1',
    email: 'spieler@myclub.de', 
    password: 'password123',
    displayName: 'Tom Spieler',
    emailVerified: true,
    role: 'player'
  }
]

const seedClubs = [
  {
    id: 'fc-beispiel',
    name: 'FC Beispiel',
    slug: 'fc-beispiel',
    description: 'Ein Beispiel-Fußballverein für Demo-Zwecke',
    logo: null,
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981'
    },
    address: {
      street: 'Sportplatzstraße 1',
      city: 'Musterstadt',
      postalCode: '12345',
      country: 'Deutschland'
    },
    contact: {
      email: 'info@fc-beispiel.de',
      phone: '+49 123 456789',
      website: 'https://fc-beispiel.de'
    },
    settings: {
      isPublic: true,
      allowRegistration: true,
      requireApproval: false,
      features: ['teams', 'matches', 'training', 'statistics']
    },
    subscription: {
      plan: 'professional',
      status: 'active',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      features: ['teams', 'matches', 'training', 'statistics']
    },
    stats: {
      memberCount: 3,
      teamCount: 2,
      matchCount: 5,
      activeSeasons: ['2024-2025']
    },
    createdBy: 'admin-user-1',
    updatedBy: 'admin-user-1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  }
]

const seedTeams = [
  {
    id: 'fc-beispiel-u17',
    clubId: 'fc-beispiel',
    name: 'FC Beispiel U17',
    category: 'youth_u17',
    ageGroup: {
      minAge: 15,
      maxAge: 17,
      birthYearRange: [2007, 2009]
    },
    season: '2024-2025',
    description: 'Unsere U17 Jugendmannschaft',
    coach: {
      userId: 'coach-user-1',
      licenseLevel: 'C-Lizenz',
      specializations: ['Jugendtraining', 'Taktik'],
      assignedAt: Timestamp.now()
    },
    players: ['player-fc-beispiel-1', 'player-fc-beispiel-2'],
    stats: {
      matchesPlayed: 3,
      wins: 2,
      draws: 1,
      losses: 0,
      goalsFor: 8,
      goalsAgainst: 3,
      points: 7,
      currentStreak: { type: 'win', count: 1 }
    },
    createdBy: 'admin-user-1',
    updatedBy: 'admin-user-1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  },
  {
    id: 'fc-beispiel-senioren',
    clubId: 'fc-beispiel',
    name: 'FC Beispiel Senioren',
    category: 'men_senior',
    season: '2024-2025',
    description: 'Unsere Herrenmannschaft',
    coach: {
      userId: 'admin-user-1',
      licenseLevel: 'B-Lizenz',
      specializations: ['Seniorentraining', 'Kondition'],
      assignedAt: Timestamp.now()
    },
    players: [],
    stats: {
      matchesPlayed: 2,
      wins: 1,
      draws: 0,
      losses: 1,
      goalsFor: 3,
      goalsAgainst: 2,
      points: 3,
      currentStreak: { type: 'win', count: 1 }
    },
    createdBy: 'admin-user-1',
    updatedBy: 'admin-user-1', 
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  }
]

const seedPlayers = [
  {
    id: 'player-fc-beispiel-1',
    clubId: 'fc-beispiel',
    teamId: 'fc-beispiel-u17',
    userId: 'player-user-1',
    jerseyNumber: 10,
    position: 'midfielder',
    personalInfo: {
      firstName: 'Tom',
      lastName: 'Spieler',
      dateOfBirth: new Date('2008-03-15'),
      nationality: 'Deutschland',
      height: 175,
      weight: 68
    },
    stats: {
      matchesPlayed: 3,
      goals: 4,
      assists: 2,
      yellowCards: 1,
      redCards: 0,
      minutesPlayed: 245
    },
    createdBy: 'coach-user-1',
    updatedBy: 'coach-user-1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  },
  {
    id: 'player-fc-beispiel-2',
    clubId: 'fc-beispiel',
    teamId: 'fc-beispiel-u17',
    jerseyNumber: 1,
    position: 'goalkeeper',
    personalInfo: {
      firstName: 'Lisa',
      lastName: 'Torwart',
      dateOfBirth: new Date('2007-11-22'),
      nationality: 'Deutschland',
      height: 168,
      weight: 60
    },
    stats: {
      matchesPlayed: 3,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 270
    },
    createdBy: 'coach-user-1',
    updatedBy: 'coach-user-1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  }
]

// =============================================================================
// Seeding Functions
// =============================================================================

async function createUsers() {
  console.log('Creating test users...')
  
  for (const userData of seedUsers) {
    try {
      await auth.createUser({
        uid: userData.uid,
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: userData.emailVerified
      })
      
      // Create user document in Firestore
      await db.collection('users').doc(userData.uid).set({
        email: userData.email,
        displayName: userData.displayName,
        photoURL: null,
        emailVerified: userData.emailVerified,
        roles: [],
        clubMemberships: [],
        preferences: {
          language: 'de',
          timezone: 'Europe/Berlin',
          theme: 'auto',
          notifications: {
            email: true,
            push: true,
            matchReminders: true,
            teamUpdates: true,
            financialUpdates: false
          }
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        version: 1
      })
      
      console.log(`✅ Created user: ${userData.email}`)
    } catch (error) {
      if (error.code === 'auth/uid-already-exists') {
        console.log(`⚠️  User already exists: ${userData.email}`)
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error)
      }
    }
  }
}

async function createClubs() {
  console.log('Creating test clubs...')
  
  for (const clubData of seedClubs) {
    try {
      await db.collection('clubs').doc(clubData.id).set(clubData)
      
      // Create club memberships
      await db.collection('clubs').doc(clubData.id).collection('members').doc('admin-user-1').set({
        clubId: clubData.id,
        userId: 'admin-user-1',
        status: 'active',
        joinedAt: Timestamp.now(),
        approvedBy: 'admin-user-1',
        approvedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        version: 1
      })
      
      await db.collection('clubs').doc(clubData.id).collection('members').doc('coach-user-1').set({
        clubId: clubData.id,
        userId: 'coach-user-1',
        status: 'active',
        joinedAt: Timestamp.now(),
        approvedBy: 'admin-user-1',
        approvedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        version: 1
      })
      
      console.log(`✅ Created club: ${clubData.name}`)
    } catch (error) {
      console.error(`❌ Error creating club ${clubData.name}:`, error)
    }
  }
}

async function createTeams() {
  console.log('Creating test teams...')
  
  for (const teamData of seedTeams) {
    try {
      await db.collection('teams').doc(teamData.id).set(teamData)
      console.log(`✅ Created team: ${teamData.name}`)
    } catch (error) {
      console.error(`❌ Error creating team ${teamData.name}:`, error)
    }
  }
}

async function createPlayers() {
  console.log('Creating test players...')
  
  for (const playerData of seedPlayers) {
    try {
      await db.collection('players').doc(playerData.id).set(playerData)
      console.log(`✅ Created player: ${playerData.personalInfo.firstName} ${playerData.personalInfo.lastName}`)
    } catch (error) {
      console.error(`❌ Error creating player:`, error)
    }
  }
}

// =============================================================================
// Main Seeding Function
// =============================================================================

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n')
    
    await createUsers()
    console.log()
    
    await createClubs() 
    console.log()
    
    await createTeams()
    console.log()
    
    await createPlayers()
    console.log()
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('\nTest accounts created:')
    console.log('📧 admin@myclub.de (password: password123)')
    console.log('📧 trainer@myclub.de (password: password123)')  
    console.log('📧 spieler@myclub.de (password: password123)')
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

module.exports = { seedDatabase }