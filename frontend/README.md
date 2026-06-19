# BLA Frontend

Vite + React SPA for the Bengali Literary Association. Built into `dist/` and
served statically by the existing Express backend.

## Setup

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173 (proxies /api and /assets → backend on :3000)
npm run build    # outputs to frontend/dist
```

## Deployment

The updated backend `server.js` serves `frontend/dist` and falls back to
`index.html` for SPA routing.

1. `npm run build` inside `/frontend`
2. Replace `backend/src/server.js` with the version in this PR
3. Start backend as usual

## Admin

The admin section lives at the obscure path `/admin-bla-x7k2`. It is **not
linked anywhere on the public site**. Login persists a password in
`localStorage` under the key `bla_admin_token`. Logout clears it.

## Routes

- `/` Home (TextPressure hero, notifications, events teaser)
- `/about` About (static)
- `/events` `GET /api/get/events`
- `/gallery` aggregated event gallery
- `/team` `GET /api/team`
- `/contact` `POST /api/contact` + Turnstile
- `/grievance` `POST /api/submit/help` + Turnstile
- `/terms` `GET /api/terms`
- `/privacy` `GET /api/privacy`
- `/admin-bla-x7k2` hidden admin login
- `/admin-bla-x7k2/dashboard` admin panel scaffold
