# Medical Scheduling Application

Full-stack aplikacija za zakazivanje medicinskih termina sa real-time notifikacijama i timezone podrškom.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express + TypeScript + Mongoose + Socket.io
- **Database:** MongoDB + Redis
- **Monorepo:** npm workspaces

## Prerequisites

- Node.js 18+
- MongoDB
- Redis

## Instalacija

```bash
cd medical-scheduling
npm install
npm run build -w @medical/shared
npm run seed
npm run dev
```

Seed kreira test naloge:

**NAPOMENA: VREMENSE ZONE SE KUPE AUTOMATSKI TAKO DA NAKON LOGINA U BAZI BI TREBALO DA BUDE UPISANA AUTOMATSKI SETOVANA VREMENSKA ZONA**
**JA SAM TESTIRAO MIJENJAJUCI LOKACIJU BROWSERA NA SLEDECI NACIN**

-Chrome DevTools
-Otvoriti web app
-Pritisnuti F12
-Otvoriti meni sa tri tacke ⋮ → More tools → Sensors
-Find Timezone
-Izabrati:
-America/New_York
-Europe/London
-Asia/Tokyo
-Australia/Sydney
-reload stranicu.

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

### 3. Otvoriti u browseru

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

1. **Login:** Klijent šalje IANA timezone (npr. "Europe/Warsaw")
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
# Build sve
npm run build
```
