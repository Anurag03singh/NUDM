# UPYOG Property Tax Dashboard

React dashboard for the NUDM intern task — property tax KPIs for 10 cities, comparison charts, and a Gemini chat box.

## Run

```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY
npm run dev
```

http://localhost:5173

## What's in here

- `public/properties.json` — 1000 records (fetch on load)
- KPI cards + city filter
- Recharts bar charts (collection + status)
- Chat calls `POST /api/chat` (Vite middleware in dev, Vercel serverless in production). If Gemini fails, a few sample questions still work offline.

## Env

```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite   # optional
```

Don't commit `.env`.

## Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Settings → Environment Variables** — add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) for Production.
3. Deploy. `vercel.json` serves the Vite build from `dist` and routes `/api/chat` to `api/chat.ts`.
4. Redeploy after changing env vars.
