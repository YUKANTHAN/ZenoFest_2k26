# ZenoFest 2K26

> **CODE THE NEXT ERA**

Official website for **ZenoFest 2K26** — the national-level technical fest of the Department of Information Technology, PSR Engineering College, Sivakasi.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Events](#events)
- [Deployment](#deployment)
- [Contributors](#contributors)
- [License](#license)

---

## About

ZenoFest 2K26 is a two-day national-level technical and cultural fest scheduled for **25–26 September 2026** at PSR Engineering College, Sivakasi, Tamil Nadu. The website serves as the central hub for event details, online registration, payment processing, and contact inquiries.

---

## Features

- **Cinematic Loading Screen** — Animated intro with space-to-skip
- **3D Interactive Backgrounds** — Three.js warp-speed tunnel and quantum particle sphere with fluid trail effects
- **Canvas Lightning Effects** — Procedural lightning bolts with HUD widgets
- **Glass Crack Overlay** — Click-to-crack neon SVG animation
- **Framer Motion Animations** — Smooth scroll reveals and page transitions
- **Event Registration** — Team registration with Razorpay payment integration
- **Invoice Generation** — Automated PDF invoices via WeasyPrint
- **Email Notifications** — SMTP-based confirmation emails
- **Google Sheets Sync** — Registration data synced to Google Sheets
- **Responsive Design** — Mobile-friendly with animated hamburger menu
- **Contact Form** — With embedded Google Maps

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| Vite 6 | Build tool & dev server |
| Framer Motion | Animations & transitions |
| Three.js | 3D WebGL graphics |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.10+ | Runtime |
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| PostgreSQL | Production database |
| SQLite | Development database |
| Razorpay | Payment gateway |
| WeasyPrint | PDF invoice generation |
| gspread | Google Sheets integration |

---

## Project Structure

```
ZenoFest_2k26-main/
├── index.html                  # Vite entry point
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel deployment config
├── src/
│   ├── main.jsx                # React entry
│   ├── App.jsx                 # Root component
│   ├── components/
│   │   ├── Home.jsx            # Hero section with lightning
│   │   ├── About.jsx           # About section
│   │   ├── Events.jsx          # Events listing
│   │   ├── EventModal.jsx      # Event detail modal
│   │   ├── RegisterModal.jsx   # Registration form
│   │   ├── PaymentModal.jsx    # Razorpay payment
│   │   ├── Timeline.jsx        # Fest schedule
│   │   ├── Contact.jsx         # Contact form + map
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── LoadingScreen.jsx   # Animated loader
│   │   ├── CountdownClock.jsx  # Countdown timer
│   │   ├── Gallery.jsx         # Gallery section
│   │   ├── 3d/                 # Three.js scenes
│   │   └── fx/                 # Visual effects
│   └── data/
│       └── eventsData.js       # Event definitions
└── Zenofest_backend/
    ├── main.py                 # FastAPI entry point
    ├── requirements.txt        # Python dependencies
    ├── .env.example            # Environment template
    ├── app/
    │   ├── config.py           # App settings
    │   ├── database.py         # DB engine
    │   ├── models/             # SQLAlchemy models
    │   ├── routers/            # API route handlers
    │   ├── schemas/            # Pydantic schemas
    │   └── services/           # Email, Sheets, Invoice
    └── zenofest.db             # SQLite dev database
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **pip** (Python package manager)
- **Git**

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Yukanthan/ZenoFest_2k26-main.git
cd ZenoFest_2k26-main

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at **http://localhost:5173**.

#### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |

### Backend Setup

```bash
# Navigate to backend directory
cd Zenofest_backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Start the backend server
uvicorn main:app --reload
```

The backend will be available at **http://localhost:8000**.

- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc Docs:** http://localhost:8000/redoc

---

## Environment Variables

Copy `.env.example` to `.env` in the `Zenofest_backend/` directory and fill in:

```env
# Database (PostgreSQL for production, SQLite for dev)
DATABASE_URL=postgresql://user:password@localhost/zenofest

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google Sheets (service account JSON, base64 encoded)
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=base64_encoded_service_account_json

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_smtp_app_password
ORGANIZER_EMAIL=organizer@zenofest.com

# Application
APP_SECRET_KEY=your_long_random_secret_key_here
FRONTEND_URL=http://localhost:5173
```

> **Note:** For development, the backend uses SQLite by default (`zenofest.db`). Set `DATABASE_URL` only if using PostgreSQL.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/events/` | List all events |
| `POST` | `/api/registrations/` | Create registration + Razorpay order |
| `POST` | `/api/payments/create-order` | Create/retry Razorpay order |
| `POST` | `/api/payments/verify` | Verify Razorpay payment signature |
| `POST` | `/api/payments/webhook` | Razorpay webhook handler |
| `POST` | `/api/contact/` | Submit contact form |
| `GET` | `/api/invoices/{registration_id}` | Get invoice details |
| `POST` | `/api/lookup/` | Look up registrations by email |

---

## Events

| # | Event | Type | Team Size | Prize |
|---|-------|------|-----------|-------|
| 1 | Project Expo | Technical (Flagship) | 2–3 | INR 10,000 |
| 2 | UI/UX Designathon | Technical | 2–3 | — |
| 3 | Logic Hunt | Technical | 2–3 | — |
| 4 | Who Am I? | Non-Technical | 2–3 | — |
| 5 | Rapid Fire | Non-Technical | 2–3 | — |
| 6 | Free Fire | Non-Technical (Esports) | 2–3 | Yes |

---

## Deployment

### Frontend (Vercel)

The project includes `vercel.json` — just connect the repo to [Vercel](https://vercel.com) and it will auto-deploy.

### Backend

Deploy the FastAPI backend to any Python-compatible host (Railway, Render, etc.). Update `FRONTEND_URL` in your `.env` to match the deployed frontend URL.

---

## Contributors

**Website Development Team (III/IT):**
- Bhuvaneshwari A
- Vignesh B
- Veni Vaishnavi M
- Yukanthan P G
- Logeshwari P
- Ramakrishnan M
- Ram Kumar J

**Student Coordinators:**
- Thayanithi M — +91 6380877556
- Ashwin Kumar — +91 8940678167

**Faculty Coordinators:**
- Mr. S. Shunmuga Sundaram (AP/IT)
- Ms. M. Anitha (AP/IT)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

**PSR Engineering College, Sivakasi** — Department of Information Technology
