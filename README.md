# 🏆 MyClub Management

> Firebase-First Fußball-Vereinsmanagementplattform mit Next.js und React Native

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firebase](https://img.shields.io/badge/firebase-ready-orange.svg)

## 🎯 **Über das Projekt**

MyClub Management ist eine moderne, skalierbare Plattform für die Verwaltung von Fußball-Amateuvereinen. Mit Multi-Tenant-Architektur, rollenbasierter Zugriffskontrolle und Real-time-Features.

### ✨ **Hauptfunktionen**
- 👥 **Multi-Tenant** - Separate Datenbanken pro Verein
- 🔐 **Rollen-System** - Admin, Trainer, Spieler mit unterschiedlichen Berechtigungen
- 📱 **Cross-Platform** - Web-App (Next.js) + Mobile App (React Native)
- 🔔 **Push-Notifications** - Training-Absagen, Spiel-Erinnerungen
- ⚡ **Real-time Updates** - Live-Datensynkronisation
- 📊 **Analytics** - Detaillierte Statistiken und Reports

## 🏗️ **Technologie-Stack**

### Frontend
- **Web:** Next.js 14 + TypeScript + Tailwind CSS
- **Mobile:** React Native + Expo
- **UI Library:** Storybook + Headless UI
- **State Management:** Zustand

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Functions:** Firebase Cloud Functions
- **Storage:** Firebase Storage
- **Messaging:** Firebase Cloud Messaging (FCM)

### DevOps
- **Hosting:** Vercel (Web) + Firebase (Functions)
- **CI/CD:** GitHub Actions
- **Monitoring:** Firebase Analytics + Sentry

## 📁 **Projekt-Struktur**

```
myclub-management/
├── web/                    # Next.js Web Application
│   ├── src/app/           # App Router (Next.js 14)
│   ├── src/components/    # React Components
│   ├── src/lib/          # Firebase, Utils, Types
│   └── src/stores/       # Zustand State Management
├── mobile/                # React Native Mobile App
│   ├── app/              # Expo Router
│   ├── components/       # Mobile Components
│   └── services/         # Firebase Services
├── functions/             # Firebase Cloud Functions
│   └── src/              # TypeScript Functions
├── docs/                  # Projekt-Dokumentation
└── .storybook/           # Component Library
```

## 🚀 **Schnellstart**

### Voraussetzungen
- Node.js 18+ 
- npm 9+
- Firebase CLI
- Git

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/NicoPDR24/myclub-management.git
   cd myclub-management
   ```

2. **Dependencies installieren**
   ```bash
   npm run setup
   ```

3. **Firebase konfigurieren**
   ```bash
   # Firebase CLI installieren (falls nicht vorhanden)
   npm install -g firebase-tools
   
   # Bei Firebase anmelden
   firebase login
   
   # Projekt initialisieren
   firebase init
   ```

4. **Entwicklung starten**
   ```bash
   # Alle Services starten
   npm run dev
   
   # Oder einzeln:
   npm run web:dev      # Web-App (http://localhost:3000)
   npm run mobile:dev   # Mobile App
   npm run storybook    # Component Library
   ```

## 📚 **Dokumentation**

- 📖 [Entwickler-Guide](docs/DEVELOPMENT.md)
- 🏗️ [Architektur](docs/ARCHITECTURE.md)
- 🚀 [Deployment](docs/DEPLOYMENT.md)
- 🧪 [Testing](docs/TESTING.md)
- 🔧 [API Referenz](docs/API.md)

## 🎭 **Rollen & Berechtigungen**

### 🔴 **ADMIN** (Vereinsadministrator)
- Vollzugriff auf alle Vereinsdaten
- Teams, Spieler, Personal verwalten
- News erstellen und bearbeiten
- Transfers durchführen
- System-Einstellungen

### 🟡 **TRAINER** (Mannschaftsverantwortlicher) 
- Eigene Teams verwalten
- Training planen und absagen
- Aufstellungen erstellen
- Team-News verfassen
- Spielstatistiken eingeben

### 🟢 **SPIELER** (Vereinsmitglied)
- Eigenes Profil bearbeiten
- Team-Termine einsehen
- Vereinsnews lesen
- Push-Benachrichtigungen erhalten
- Eigene Statistiken einsehen

## 🔧 **Entwicklung**

### Verfügbare Scripts

```bash
# Entwicklung
npm run dev              # Alle Services
npm run web:dev          # Nur Web-App
npm run mobile:dev       # Nur Mobile App

# Build
npm run build           # Production Build
npm run test           # Tests ausführen
npm run lint           # Code Linting

# Utils
npm run clean          # Node Modules löschen
```

### Git Workflow

```bash
# Feature entwickeln
git checkout -b feature/neue-funktion
git add .
git commit -m "feat: neue Funktion implementiert"
git push origin feature/neue-funktion
```

## 🚢 **Deployment**

### Automatisches Deployment
- **Web-App:** Automatisch auf Vercel bei Push zu `main`
- **Mobile App:** EAS Build über GitHub Actions
- **Cloud Functions:** Firebase Functions Deploy

### Manuelles Deployment
```bash
# Web App
npm run build:web
vercel --prod

# Firebase Functions  
npm run build:functions
firebase deploy --only functions

# Mobile App
cd mobile
eas build --platform all
```

## 🤝 **Beitragen**

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'feat: Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 **Lizenz**

Dieses Projekt ist unter der MIT Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

## 👨‍💻 **Autor**

**NicoPDR24** - [GitHub](https://github.com/NicoPDR24)

---

**🚀 Status: In Entwicklung** | **📧 Support:** [Issues](https://github.com/NicoPDR24/myclub-management/issues)
