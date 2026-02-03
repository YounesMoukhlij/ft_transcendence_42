# ft_transcendence

## General description

**ft_transcendence** is a full-stack web application built for the 42 school Transcendence project. It is a real-time multiplayer ping-pong platform with social features, tournaments, and OAuth-based authentication. Users can play locally, against an AI, or online with friends, participate in tournaments, chat, and track their progress on a leaderboard and in leagues.

---

## Core features

- **Authentication** — Email/password sign up and login, Google OAuth, 42 Intra OAuth, two-factor authentication (2FA), forgot password flow
- **User profile & settings** — Profile page, avatar, bio, preferences, account deletion, security and 2FA management
- **Real-time ping-pong game** — Local (2 players), vs AI, remote multiplayer (invite friend), customizable paddles and ball
- **Tournaments** — Local tournaments (4 players) and online tournaments with bracket system; tournament results can be recorded on blockchain
- **Social** — Friends list, friend requests, real-time chat, typing indicators, notifications (friend requests, game invites)
- **Leaderboard & leagues** — Global leaderboard, league tiers, match history, player stats and progress
- **Infrastructure** — Docker stack (frontend, backend, Redis, WAF/ModSecurity, HashiCorp Vault), WebSocket-based real-time updates

---

## Tech used

| Layer        | Technologies |
|-------------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, NextAuth, Axios, WebSocket (ws) |
| **Backend**  | Node.js, Fastify, better-sqlite3, Redis, JWT, bcrypt, OTP (otplib), QRCode, ethers (blockchain), node-vault |
| **Database** | SQLite (better-sqlite3) |
| **Real-time**| WebSockets (ws), Redis |
| **Infra**    | Docker, Docker Compose, Nginx + ModSecurity (WAF), HashiCorp Vault |

---

## How to install and run the project

### Prerequisites

- **Node.js** (v18+)
- **npm**
- **Docker** and **Docker Compose** (for running the full stack)

### Option 1: Run with Docker (recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ft_transcendence_42
   ```

2. Configure environment variables:
   - Copy `backend/.env.example` to `backend/.env` (if present) or create `backend/.env` with at least:
     - `PORT`, `HOST`, `SECRET`, `JWT_SECRET`, `REFRESH_JWT_SECRET`
     - `REDIS_URL` (e.g. `redis://redis:6379`)
     - `FRONTEND_URL` (e.g. `https://localhost:8080/`)
     - Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
     - 42 OAuth: `INTRA42_CLIENT_ID`, `INTRA42_CLIENT_SECRET`, `INTRA42_REDIRECT_URI`
     - Optional: `CONTRACT_ADDRESS`, `PRIVATE_KEY` for blockchain

3. Build and start all services:
   ```bash
   docker-compose up --build
   ```

4. Access the app:
   - **Frontend**: typically behind the WAF at `https://localhost:8080` (see `docker-compose.yml` for exact ports)
   - **Backend**: used by the frontend; Redis on port `6380` (mapped from 6379)

### Option 2: Run locally (without Docker)

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # or create .env with required variables
   # Ensure Redis is running locally and REDIS_URL points to it (e.g. redis://localhost:6379)
   npm run dev
   ```
   Backend runs by default on the port set in `backend/.env` (e.g. `4444`).

2. **Frontend**
   ```bash
   cd frontend
   npm install
   # Set NEXT_PUBLIC_API_URL or equivalent in .env to your backend URL
   npm run dev
   ```
   Frontend runs at `http://localhost:3000` (or the port Next.js reports).

3. Use the same OAuth and API URLs in both `.env` files so login and API calls work (e.g. `FRONTEND_URL` and backend URL).

---

## Authors

- [Younes Moukhlij](https://github.com/YounesMoukhlij)
- [Zakaria Moumni](https://github.com/MoumniZakaria)
- [Ayoub Lamini](https://github.com/AyoubLamini)
- [Abdelmoughit Echcharbiny](https://github.com/mrmoughit)

---

## License

ISC (see `backend/package.json`). This project is part of the 42 curriculum.
