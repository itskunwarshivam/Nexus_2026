# NEXUS 2026 — Event Registration & Management Platform

> **Vanguard Institute of Technology × IIT Delhi**
> Premier Space-Opera & Sci-Fi Themed Multi-Club Tech Fest Platform

NEXUS 2026 is a Next.js 16 full-stack web application for event management, student registration, verify pass checking, and multi-admin event management with automatic email pass dispatches (Nodemailer + QR code generation) and Excel report exports (.xlsx).

---

## 🌟 Key Features

- **Cinematic Sci-Fi UI**: Star field animation, matrix hacking authentication screen, cybernetic HUD elements.
- **Permanent Tech Code vs. Per-Event Pass**:
  - **Tech Code (`TECH-XXXXX`)**: Permanent per-user identifier created on first registration. Used to view all passes at `/dashboard`.
  - **Registration Code (`NEX-2026-XXXXX`)**: Unique pass code generated per event registration.
- **Smart Returning User Auto-Detection**:
  - Auto-retrieves existing operative profile when an existing registered email is typed into registration form.
- **Instant Email & QR Pass Dispatch**:
  - Sends styled email with embedded QR Code pass via Nodemailer on every registration.
- **Multi-Admin Control Center (`/admin`)**:
  - Admin login with credentials stored in `data/admins.json`.
  - Live real-time statistics (Total Registrations, Active Missions, Unique Participants).
  - Instant Check-in Scanner & Registration Verifier.
  - One-click Excel (.xlsx) data export per event or all combined.
- **IRCTC-Style Printable E-Ticket**:
  - 2-page printable official ticket with QR codes and fest guidelines.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **pnpm** / **yarn**

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/itskunwarshivam/Nexus_2026.git
cd Nexus_2026

# Install dependencies
npm install
```

---

## 🔑 Configuration & Setup

### 1. Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory of your project:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> **Note for Gmail Users**: `EMAIL_PASS` must be an **App Password** generated from your Google Account settings (Security → 2-Step Verification → App passwords), not your personal account password.

---

### 2. Admin Credentials Setup (`data/admins.json`)

Create the directory `data` (if it doesn't exist) and place a file named `admins.json` inside it:

**Path**: `data/admins.json`

```json
[
  {
    "id": "adm-01",
    "username": "admin",
    "email": "admin@ne.edu",
    "password": "a123n",
    "name": "Chief Commander Alex",
    "role": "SUPER_ADMIN",
    "badge": "LEVEL 5 CLEARANCE"
  },
  {
    "id": "adm-02",
    "username": "organizer",
    "email": "organizer@nex26.edu",
    "password": "a123n",
    "name": "Event Coordinator Sarita",
    "role": "EVENT_ORGANIZER",
    "badge": "LEVEL 3 CLEARANCE"
  }
]
```

---

## 🖥️ Running the Application

### Start Development Server

```bash
npm run dev
```

Open your browser and navigate to:
- **Main Website**: [http://localhost:3000](http://localhost:3000)
- **Event Registration**: [http://localhost:3000/register](http://localhost:3000/register)
- **Verify Pass / Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Admin Command Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔐 Admin Login Credentials

| Username | Password | Role | Clearance Badge |
|---|---|---|---|
| `admin` | `a123n` | Super Admin | Level 5 Clearance |
| `organizer` | `a123n` | Event Organizer | Level 3 Clearance |

---

## 🛠️ Build for Production

```bash
# Build Next.js application
npm run build

# Start production server
npm run start
```

---

## 📁 Project Structure

```text
├── data/
│   ├── admins.json            # Admin user credentials (create manually)
│   ├── registrations/         # Master and per-event JSON & XLSX data (auto-created)
│   └── emails/                # Local email payload logs (auto-created)
├── src/
│   ├── app/
│   │   ├── admin/             # Admin login & command center dashboard
│   │   ├── api/               # API routes (register, verify, admin auth, export, stats)
│   │   ├── clubs/             # Club showcase pages
│   │   ├── dashboard/         # Student pass verification & printable ticket
│   │   ├── events/            # Mission & event detail pages
│   │   └── register/          # Step-by-step registration flow
│   ├── components/            # Reusable UI components (Navbar, Footer, Starfield, etc.)
│   └── lib/                   # Data definitions & helper utilities
├── .env.local                 # Local environment variables (create manually)
└── README.md                  # Documentation
```

---

## 📄 License

This project is built for NEXUS 2026 — Organized by Vanguard Institute of Technology in collaboration with IIT Delhi.
