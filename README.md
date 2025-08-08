# MyClub Management 🏆

Eine moderne, Firebase-basierte Fußballvereinsmanagement-Plattform mit Multi-Tenant-Architektur, Next.js Frontend und React Native Mobile App.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firebase](https://img.shields.io/badge/firebase-ready-orange.svg)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue.svg)

## 🚀 Features

- **Multi-Tenant Architektur** - Ein System, mehrere Vereine
- **Team Management** - Verwalten Sie mehrere Teams mit Spielerlisten
- **Spielerstatistiken** - Detaillierte Leistungsanalysen  
- **Spielplanung** - Matches, Trainings und Turniere
- **Mobile App** - Native iOS/Android App mit Offline-Funktionen
- **Real-time Updates** - Live-Synchronisation zwischen Geräten
- **DSGVO-konform** - Höchste Datenschutz- und Sicherheitsstandards

## 🏗️ Technologie-Stack

### Frontend (Web)
- **Next.js 14** - React Framework mit App Router
- **TypeScript** - Type-safe Development
- **Tailwind CSS** - Utility-first CSS Framework
- **Firebase SDK v9+** - Authentication & Firestore

### Backend
- **Firebase** - Backend-as-a-Service
- **Cloud Functions** - Serverless Functions
- **Firestore** - NoSQL Database
- **Firebase Auth** - Authentication & Authorization

### Mobile
- **React Native** - Cross-platform Mobile Development
- **Expo** - Development Platform

### Development
- **Monorepo** - NPM Workspaces
- **ESLint + Prettier** - Code Quality & Formatting
- **TypeScript Strict Mode** - Maximum Type Safety

## 📁 Projekt-Struktur

```
myclub-management/
├── web/                    # Next.js Web App
│   ├── app/               # Next.js 14 App Router
│   ├── components/        # React Komponenten
│   └── lib/              # Utilities & Services
├── mobile/               # React Native App
├── functions/           # Firebase Cloud Functions
├── shared/             # Shared Types & Utils
│   ├── types/         # TypeScript Definitionen
│   ├── constants/     # App-weite Konstanten
│   └── utils/         # Utility Functions
└── .storybook/        # Component Documentation
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+
- Firebase CLI

### Installation

```bash
# Repository klonen
git clone https://github.com/NicoPDR24/myclub-management.git
cd myclub-management

# Dependencies installieren
npm install

# Environment Variables konfigurieren
cp web/.env.local.example web/.env.local
# Demo-Konfiguration ist bereits gesetzt für lokale Entwicklung
```

### Firebase Emulators Setup

```bash
# Firebase Tools sind bereits als devDependency installiert

# Emulators starten
npm run emulators

# In einem neuen Terminal: Test-Daten laden
npm run seed
```

### Development Server starten

```bash
# Nur Web-App
npm run web:dev

# Oder: Web + Firebase Emulators
npm run dev:full
```

Die Anwendung ist verfügbar unter:
- **Web App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000

### Test Accounts

Nach dem Seeding stehen folgende Test-Accounts zur Verfügung:

- **Admin**: admin@myclub.de (Passwort: password123)
- **Trainer**: trainer@myclub.de (Passwort: password123)  
- **Spieler**: spieler@myclub.de (Passwort: password123)

## 🏃‍♂️ Available Scripts

### Root Level
```bash
npm run dev              # Start Web + Mobile development
npm run build           # Build all workspaces
npm run test            # Run all tests
npm run lint            # Lint all workspaces
npm run emulators       # Start Firebase emulators
npm run seed            # Populate emulators with test data
npm run dev:full        # Start Web + Emulators together
```

### Web App
```bash
npm run web:dev         # Start Next.js development server
npm run web:build       # Build for production
npm run web:start       # Start production server
```

### Mobile App
```bash
npm run mobile:dev      # Start Expo development server
npm run mobile:build    # Build mobile apps
```

### Cloud Functions
```bash
npm run functions:dev   # Start functions in watch mode
npm run functions:build # Build functions
npm run functions:deploy # Deploy to Firebase
```

## 🔥 Firebase Configuration

### Environment Variables

Die `.env.local` ist bereits mit Demo-Werten für lokale Entwicklung konfiguriert. Für Produktion kopieren Sie `.env.local.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Security Rules

Die Firestore Security Rules sind bereits konfiguriert für:
- Multi-Tenant Isolation
- Role-based Access Control
- Sichere Datenabfragen

## 📚 Dokumentation

### Architektur-Entscheidungen
- **Multi-Tenant**: Jeder Verein ist isoliert, teilt sich aber die Infrastruktur
- **Type-First**: TypeScript für maximale Typsicherheit
- **Component-Driven**: Wiederverwendbare UI-Komponenten
- **Offline-First**: Mobile App funktioniert auch ohne Internet

### Code-Stil
- **Functional Components** mit Hooks
- **Strict TypeScript** Konfiguration
- **ESLint + Prettier** für konsistente Formatierung
- **Explizite Imports** für bessere Tree-Shaking

## 🚢 Deployment

### Web App (Firebase Hosting)
```bash
npm run build:web
firebase deploy --only hosting
```

### Cloud Functions
```bash
npm run build:functions  
firebase deploy --only functions
```

### Mobile App
```bash
# Build für App Stores
npm run build:mobile
```

## 🔒 Sicherheit

- **DSGVO-konform** - Alle Datenschutzrichtlinien implementiert
- **Firebase Security Rules** - Server-side Validierung
- **Authentication** - JWT-basierte Benutzer-Authentifizierung
- **HTTPS-only** - Alle Daten verschlüsselt übertragen
- **Input Validation** - Client- und Server-side Validierung

## 🧪 Testing

```bash
# Unit Tests
npm run test

# Linting
npm run lint

# Emulator-basierte Entwicklung
npm run emulators
```

## 🎭 Rollen & Berechtigungen

### 🔴 ADMIN (Vereinsadministrator)
- Vollzugriff auf alle Vereinsdaten
- Teams, Spieler, Personal verwalten
- System-Einstellungen

### 🟡 TRAINER (Mannschaftsverantwortlicher) 
- Eigene Teams verwalten
- Training planen
- Aufstellungen erstellen
- Spielstatistiken eingeben

### 🟢 SPIELER (Vereinsmitglied)
- Eigenes Profil bearbeiten
- Team-Termine einsehen
- Eigene Statistiken einsehen

## 📄 License

MIT License - siehe [LICENSE](LICENSE) für Details.

## 👥 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commiten Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie eine Pull Request

## 📞 Support

Bei Fragen oder Problemen erstellen Sie bitte ein [Issue](https://github.com/NicoPDR24/myclub-management/issues).

---

**Made with ❤️ by [NicoPDR24](https://github.com/NicoPDR24)**