# FitAI — AI-Powered Personal Fitness Assistant

A full-stack AI fitness assistant. Track your workouts, chat with an AI coach powered by GPT-4, and start voice coaching sessions — all from one dashboard.

- **Frontend** — this repo (Next.js 16)
- **Backend** — [mayank714/gym-buddy-backend](https://github.com/mayank714/gym-buddy-backend) (NestJS + SQLite)

---

## Features

- **Authentication** — Cookie-based sessions with protected routes via middleware. Unauthenticated users are redirected to `/login`.
- **Dashboard** — At-a-glance stats: total workouts, completed, planned, and chat sessions. Shows today's scheduled workout and quick-action buttons.
- **Workout Management** — Create, view, and update workouts with exercises (sets, reps, rest, notes). Supports `planned`, `in-progress`, and `completed` statuses.
- **AI Chat** — Persistent conversation history with a GPT-4 powered FitAI coach. Each session is stored and resumable.
- **Voice Coaching** — One-tap VAPI voice call integration to start a live coaching session.

---

## Repositories

| Part | Repo | Default Port |
|---|---|---|
| Frontend (this) | [gym-buddy-app](https://github.com/mayank714/gym-buddy-app) | 4200 |
| Backend | [gym-buddy-backend](https://github.com/mayank714/gym-buddy-backend) | 3000 |

---

## Tech Stack

### Frontend

| Layer | Library |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Notifications | react-hot-toast |
| Icons | lucide-react |

### Backend

| Layer | Library |
|---|---|
| Framework | NestJS 10 (TypeScript) |
| Database | SQLite via TypeORM |
| Real-time | Socket.IO |
| AI | OpenAI GPT-4 |
| Voice/Chat | VAPI |
| API Docs | Swagger (`/api/docs`) |

---

## Project Structure

```
app/
  (auth)/          # login & register pages (public)
  dashboard/       # protected dashboard, workouts, chat
  layout.tsx       # root layout with QueryProvider
  page.tsx         # redirects to /dashboard
components/
  ui/              # Button, Card, Input, Badge, Modal, Spinner
  chat/            # ConversationCard, MessageBubble
  workouts/        # WorkoutCard, WorkoutForm
  layout/          # Navbar, Sidebar
hooks/             # useAuth, useWorkouts, useChat, useUser
services/          # api.ts (Axios instance), and per-domain services
types/             # TypeScript interfaces for workouts, chat, users, API
utils/             # auth helpers, cn(), environment config
middleware.ts      # route guard (redirects unauthenticated requests)
```

---

## Getting Started

### 1. Start the backend

```bash
git clone https://github.com/mayank714/gym-buddy-backend
cd gym-buddy-backend
npm install
cp .env.example .env   # fill in VAPI_API_KEY, WEBHOOK_URL, DATABASE_NAME
npm run start:dev      # runs on http://localhost:3000
```

API docs are available at `http://localhost:3000/api/docs` once the server is running.

### 2. Start the frontend

**Prerequisites:** Node.js >= 20.9.0

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FitAI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

```bash
npm install

# Development (http://localhost:4200)
npm run dev

# Production
npm run build
npm run start        # serves on http://localhost:4200
```

---

## Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build on port 4200 |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---|---|
| `npm run start:dev` | Start with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled build |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `FitAI` |
| `NEXT_PUBLIC_APP_VERSION` | App version string | `1.0.0` |

### Backend (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_NAME` | SQLite file path |
| `VAPI_API_KEY` | VAPI authentication key |
| `WEBHOOK_URL` | URL for VAPI to send events to |

---

## Authentication Flow

- Session is stored in a `fitai-user` cookie.
- `middleware.ts` intercepts all non-static routes: unauthenticated requests redirect to `/login`; authenticated requests to `/login` or `/register` redirect to `/dashboard`.
- On a 401 response, the Axios interceptor in `services/api.ts` clears the session and redirects to `/login`.

---

## API Services

| Service | Responsibility |
|---|---|
| `user.service` | Get / update user profile |
| `workout.service` | CRUD for workouts |
| `chat.service` | Conversations, messages, transcripts |
| `vapi.service` | Start voice call, send chat via VAPI webhook |

All services share the Axios instance in `services/api.ts`, which reads `NEXT_PUBLIC_API_BASE_URL` at runtime.
