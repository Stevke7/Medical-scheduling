# Medical Scheduling Application

Full-stack aplikacija za zakazivanje medicinskih termina sa real-time notifikacijama i timezone podrškom.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express + TypeScript + Mongoose + Socket.io
- **Database:** MongoDB + Redis
- **Monorepo:** npm workspaces

## Struktura projekta

```
medical-scheduling/
├── packages/
│   ├── shared/          # Zajednički tipovi i konstante
│   ├── server/          # Express backend
│   └── client/          # React frontend
├── package.json         # Root package.json (workspaces)
└── .env                 # Environment variables
```

## Prerequisites

- Node.js 18+
- MongoDB (running locally on port 27017)
- Redis (running locally on port 6379)

### Pokretanje MongoDB i Redis (Docker)

```bash
# MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Redis
docker run -d -p 6379:6379 --name redis redis:latest
```

## Instalacija

```bash
# Kloniraj repo i uđi u folder
cd medical-scheduling

# Instaliraj sve dependencies
npm install

# Build shared package
npm run build -w @medical/shared
```

## Pokretanje

### 1. Seed baze podataka

```bash
npm run seed
```

Ovo kreira test naloge:

**Doktori (Clinic):**
- dr.smith@clinic.com / password123 (America/New_York)
- dr.jones@clinic.com / password123 (Europe/London)
- dr.mueller@clinic.com / password123 (Europe/Berlin)

**Pacijenti:**
- alice@example.com / password123 (America/Los_Angeles)
- bob@example.com / password123 (America/New_York)
- carol@example.com / password123 (Europe/Paris)
- david@example.com / password123 (Asia/Tokyo)
- emma@example.com / password123 (Australia/Sydney)

### 2. Pokreni development servere

```bash
# Pokreni oba (server + client) istovremeno
npm run dev
```

Ili odvojeno:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 3. Otvori u browseru

- **Clinic panel:** http://localhost:5173/clinic
- **Patient portal:** http://localhost:5173/patient

## Funkcionalnosti

### Clinic Panel (Doktori)

1. **Kalendar** - Mjesečni prikaz sa navigacijom (3 mjeseca unaprijed)
2. **Kreiranje pojedinačnih termina** - Klik na dan otvara formu
3. **Batch kreiranje** - Kreiraj više termina odjednom (npr. svaki dan od 1. do 5.)
4. **Timezone aware** - Vrijeme se čuva u UTC, prikazuje u doktorovoj timezone

### Patient Portal (Pacijenti)

1. **Lista termina** - Pregled svih zakazanih termina
2. **Real-time updates** - Automatski refresh kad doktor zakaže novi termin
3. **Reminder notifikacije** - 5 minuta prije termina
4. **Timezone conversion** - Termini prikazani u pacijentovoj lokalnoj timezone

### Reminder System

- Server svake minute provjerava termine koji počinju za 5 minuta
- Ako je pacijent online - šalje WebSocket notifikaciju
- Uvijek loguje u konzolu (simulacija email/SMS)

## API Endpoints

### Clinic API

```
POST /api/clinic/auth/login      - Login doktora
POST /api/clinic/auth/logout     - Logout
GET  /api/clinic/auth/status     - Provjera auth statusa

GET  /api/clinic/events          - Lista termina
POST /api/clinic/events          - Kreiraj termin
POST /api/clinic/events/batch    - Kreiraj batch termine
GET  /api/clinic/events/days-with-events - Dani sa terminima (za kalendar)
GET  /api/clinic/patients        - Lista pacijenata
```

### Patient API

```
POST /api/patient/auth/login     - Login pacijenta
POST /api/patient/auth/logout    - Logout
GET  /api/patient/auth/status    - Provjera auth statusa

GET  /api/patient/events         - Lista termina pacijenta
```

## Socket Events

### Server -> Client

- `new_event_created` - Novi termin kreiran
- `event_reminder` - Reminder 5 min prije

### Client -> Server

- `join_patient_room` - Pacijent se pridružuje sobi za notifikacije
- `leave_patient_room` - Pacijent napušta sobu

## Timezone Handling

1. **Login:** Klijent šalje IANA timezone (npr. "Europe/Belgrade")
2. **Kreiranje termina:** Doktor bira lokalno vrijeme → konvertuje se u UTC
3. **Prikaz termina:** UTC iz baze → konvertuje se u pacijentovu timezone
4. **Reminders:** Računaju se na osnovu UTC vremena

## Napomene

- Svi termini traju 30 minuta (fiksno)
- Duplikati termina se ne provjeravaju (po zadatku)
- Session se čuva u Redis-u (7 dana)
- Autentikacija je cookie-based (ne JWT)

## Development

```bash
# Lint
npm run lint

# Build sve
npm run build
```
