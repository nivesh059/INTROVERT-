# INTROVERT — Android voice & social rooms

A full-source **MVP foundation** for INTROVERT: a dark black/purple social voice-chat app with 12-seat rooms, host/admin/speaker controls, LiveKit audio/video rooms, chat, profiles, friends/followers, gifts/coins/VIP, leaderboard, notifications, country tags, and room themes.

> **Honest status:** this repository is a runnable MVP foundation, not a production-certified social network. Core authentication, room APIs, LiveKit token issuance, chat persistence, profile/friend actions, wallet ledger, gifts, leaderboard, notifications, and web UI are implemented at starter level. Real payment processing, push delivery, robust moderation, anti-fraud, app-store compliance, scalable presence, and security audits still require production work. See [PRODUCTION_STATUS.md](PRODUCTION_STATUS.md).

## Stack
- Node.js + Express API
- PostgreSQL + Prisma
- LiveKit Cloud for real-time audio/video
- Web client bundled into Android using Capacitor
- GitHub Actions Android debug APK workflow

## Requirements
- Node.js 20+
- PostgreSQL 15+
- Android Studio (for local APK builds) or GitHub Actions
- A LiveKit Cloud project

## 1. Configure
Copy `.env.example` to `server/.env` and fill:
- `DATABASE_URL`
- `JWT_SECRET` (long random value)
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

**Never put LiveKit API secret in Android/web code, GitHub commits, screenshots, or chat.** Configure it only as a server environment variable / GitHub Secret.

LiveKit URL supplied for this project:
`wss://come-on-24nhws0l.livekit.cloud`

## 2. Start backend
```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
API listens on `http://localhost:4000`.

## 3. Start web client
In another terminal:
```bash
npm install
npm run dev
```
Open the Vite URL shown in terminal. Set `VITE_API_URL=http://localhost:4000` in root `.env.local` if needed.

## 4. Android project
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
Build an APK from Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

The GitHub Actions workflow builds a debug APK when pushed to `main` or manually dispatched. Add GitHub repository secrets:
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `DATABASE_URL`
- `JWT_SECRET`
- `API_BASE_URL` (public HTTPS URL of your deployed API, used by the Android app)

The workflow builds the Android wrapper; backend hosting and PostgreSQL hosting are separate deployments.

## 5. API overview
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/me`, `PATCH /api/me`
- `GET /api/rooms`, `POST /api/rooms`, `POST /api/rooms/:id/join`, `POST /api/rooms/:id/leave`
- `POST /api/livekit/token` (authenticated; room membership required)
- `GET /api/messages/:roomId`, `POST /api/messages/:roomId`
- `POST /api/friends/:userId`
- `POST /api/follow/:userId`
- `GET /api/leaderboard`
- `GET /api/notifications`
- `GET /api/wallet`, `POST /api/gifts/:giftId/send`

## 6. Important launch checklist
1. Deploy API behind HTTPS.
2. Provision managed PostgreSQL and run `npx prisma migrate deploy`.
3. Set server secrets in hosting environment.
4. Set `VITE_API_URL` to the deployed API before building.
5. Configure LiveKit allowed origins / deployment settings.
6. Add privacy policy, terms, community guidelines, age policy and account deletion.
7. Complete security, load, abuse and payment testing before public release.
