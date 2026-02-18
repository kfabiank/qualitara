# Qualitara Staff Fullstack Interview  Project (Next.js + Node/Express)

This repo contains:
- `frontend/` — Next.js 14 (React + TypeScript + Tailwind)
- `backend/` — Node.js (Express + TypeScript) API that proxies JSONPlaceholder

## Prereqs
- Node 18+ recommended

## Run (2 terminals)

### 1) Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:4000

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

## Endpoints
- GET http://localhost:4000/api/posts
- GET http://localhost:4000/api/posts/:id
- GET http://localhost:4000/api/posts/:id/comments

## Notes
The frontend calls the backend using `NEXT_PUBLIC_API_BASE`.
If not set, it defaults to `http://localhost:4000`.
# qualitara
