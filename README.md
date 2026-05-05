# Gym Buddy

A full-stack fitness companion app built with Next.js 16. Track your workouts, chat with an AI coach, and start voice coaching sessions — all from one dashboard.

---

## Features

- **Authentication** — Cookie-based sessions with protected routes via middleware. Unauthenticated users are redirected to `/login`.
- **Dashboard** — At-a-glance stats: total workouts, completed, planned, and chat sessions. Shows today's scheduled workout and quick-action buttons.
- **Workout Management** — Create, view, and update workouts with exercises (sets, reps, rest, notes). Supports `planned`, `in-progress`, and `completed` statuses.
- **AI Chat** — Persistent conversation history with a Gym Buddy AI coach. Each session is stored and resumable.
- **Voice Coaching** — One-tap VAPI voice call integration to start a live coaching session.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Notifications | react-hot-toast |
| Icons | lucide-react |

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

### Prerequisites

- Node.js >= 20.9.0
- A running backend API (set via `NEXT_PUBLIC_API_BASE_URL`)

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Gym Buddy
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Install & Run

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm run dev

# Production build + start
npm run build
npm run start        # serves on http://localhost:4200
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build on port 4200 |
| `npm run lint` | Run ESLint |

---

## Authentication Flow

- Session is stored in a `gym-buddy-user` cookie.
- `middleware.ts` intercepts all non-static routes: unauthenticated requests redirect to `/login`; authenticated requests to `/login` or `/register` redirect to `/dashboard`.
- On a 401 response, the Axios interceptor in `services/api.ts` clears the session and redirects to `/login`.

---

## API Services

| Service | Endpoints |
|---|---|
| `user.service` | Get / update user profile |
| `workout.service` | CRUD for workouts |
| `chat.service` | Conversations, messages, transcripts |
| `vapi.service` | Start voice call, send chat via VAPI webhook |

All services share the Axios instance in `services/api.ts`, which reads `NEXT_PUBLIC_API_BASE_URL` at runtime.
