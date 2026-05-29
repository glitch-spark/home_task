# home_task

Influur home task — **Creator Intake Review Agent** (Next.js 14, PostgreSQL, Prisma, Tailwind).

## Prerequisites

- Node.js 20+
- Docker (local PostgreSQL)

## Setup

```bash
npm install
cp .env.example .env.local
docker compose up -d db
npm run db:migrate:deploy   # applies prisma/migrations/
npm run db:seed             # 1 campaign + 7 creators
npm run dev
```

For local development you may use `npm run db:push` instead of migrate.

Open [http://localhost:3000](http://localhost:3000) → redirects to `/applications`.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL URL (see `.env.example`) |
| `OPENAI_API_KEY` | Server-only; required for `POST .../review` |

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/campaigns/[campaignId]` | Campaign context |
| `GET` | `/api/applications` | List apps (`?campaignId=`, `?status=`, `?platform=`, `?sort=`, `?order=`) |
| `GET` | `/api/applications/[id]` | Application detail + latest review |
| `PATCH` | `/api/applications/[id]` | Update `status` and/or `manualNote` |
| `POST` | `/api/applications/[id]/review` | Run AI review (saves `AgentReview` + `AgentRun`) |
| `GET` | `/api/applications/[id]/runs` | Agent run audit history (`?verbose=true` includes rawInput/rawOutput) |
| `GET` | `/api/applications/[id]/reviews` | All AI reviews for application |

`GET /api/applications` uses the first seeded campaign when `campaignId` is omitted.

## Database

- Schema: `prisma/schema.prisma` — `Campaign`, `CreatorApplication`, `AgentReview`, `AgentRun`
- Seed: `npm run db:seed` (1 GlowPop campaign, **7** sample creators)
- Migrations: `prisma/migrations/20260529120000_init/` — apply with `npm run db:migrate:deploy`

## AI agent design

- **Structured JSON output:** `fitScore`, `recommendation`, `reasoning`, `risks`, `missingInfo`, `suggestedReply` — schema in `src/server/agent/json-schema.ts`, validated with Zod.
- **Grounding:** Campaign + application data are serialized from PostgreSQL into delimited `<campaign_context>` / `<application_context>` blocks; the model is instructed to use only those facts.
- **Security (ai-security):** `OPENAI_API_KEY` is server-only (`src/lib/llm.ts` + `import "server-only"`). User text is scanned for injection patterns before the LLM call; per-application review cooldown; no agent tools beyond structured JSON emission.

## Known tradeoffs

- **Single-campaign scope:** The dashboard defaults to the first seeded campaign when `campaignId` is omitted. There is no campaign picker UI yet.
- **Fit-score sorting in memory:** Sorting by `fitScore` happens in the service layer after fetching rows (because the score lives on `AgentReview`, not `CreatorApplication`). Fine for seeded data; would move to a SQL join or materialized latest-review column at scale.
- **In-memory review cooldown:** The 15s per-application rate limit uses a process-local `Map`, so it resets on deploy/restart and does not coordinate across multiple app instances.
- **Latest review only in UI:** The detail page shows the most recent AI review. `GET /api/applications/[id]/reviews` returns full history but is not wired into the frontend.
- **Manual notes excluded from grounding:** Notes are scanned by guardrails but not passed into the LLM context, so the agent cannot factor in manager context when re-running a review.
- **Heuristic injection guard:** Pattern matching blocks obvious prompt-injection attempts but is not a substitute for full input/output moderation or a dedicated security layer.
- **No authentication:** Assumes a trusted internal tool. A production deployment would need auth (e.g. SSO, magic link, or Render private networking).
- **Manual production seed:** After first Render deploy, seed data is applied via Shell (`npm run db:seed`) rather than an idempotent bootstrap step in the start command.
- **Prisma env file:** Prisma CLI reads `.env`, not `.env.local`. For local dev, copy or symlink: `cp .env.local .env`.

## What I would improve with more time

1. **Review history UI** — Timeline of past reviews and expandable verbose run details (raw input/output) on the detail page.
2. **Apply recommendation action** — Optional one-click “Apply AI suggestion” that maps `recommendation` → `status`, with confirmation.
3. **Multi-campaign support** — Campaign selector on the dashboard and campaign-scoped filters.
4. **Stronger agent ops** — Redis-backed rate limits, retry with backoff on transient LLM failures, structured logging/metrics on run outcomes.
5. **Tests** — Integration tests for the review pipeline (mock LLM), API route tests, and a smoke E2E for dashboard → detail → review flow.
6. **Richer grounding** — Include `manualNote` and prior review summaries in context when re-running; optional campaign brief uploads.
7. **Deploy ergonomics** — Idempotent seed/migrate in CI or start script; staging environment with separate DB.

## Project layout

```
prisma/
  schema.prisma
  seed.ts
src/
  app/                    # Pages + Route Handlers
  components/             # Dashboard + detail UI
  server/
    campaigns/
    applications/
    agent/                # prompts, Zod schemas, review orchestration
  lib/                    # db, env, llm
  types/
```

## Deploy on Render

The app must be live on Render with PostgreSQL (take-home requirement). Use the blueprint in `render.yaml` or configure manually.

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint** → connect the repo.
3. Render creates:
   - **Web Service** `creator-intake-review` (Node 20)
   - **PostgreSQL** `creator-intake-db`
4. After the first deploy, open the web service **Shell** and run once:
   ```bash
   npm run db:seed
   ```
5. Copy the web service **URL** for submission (e.g. `https://creator-intake-review.onrender.com`).

### Option B — Manual setup

**1. PostgreSQL**

| Setting | Value |
|---------|--------|
| Name | `creator-intake-db` |
| Database | `home_task` |
| User | `home_task` |
| Plan | Free (or higher) |

Copy the **Internal Database URL** (used by the web service in the same region).

**2. Web Service**

| Setting | Value |
|---------|--------|
| Environment | **Node** |
| Branch | `main` (or your default) |
| Root directory | *(repo root)* |
| **Build command** | `npm ci && npm run build` |
| **Start command** | `npm run start:render` |
| Health check path | `/api/health` |

`start:render` runs `prisma migrate deploy` then `next start` so the schema is applied on every deploy.

**3. Environment variables**

| Key | How to set | Required |
|-----|------------|----------|
| `DATABASE_URL` | Link the Postgres instance (**Add from database**) or paste **Internal Database URL** | Yes |
| `OPENAI_API_KEY` | **Secret** — your OpenAI (or compatible) API key | Yes for AI review |
| `NODE_ENV` | `production` | Yes (auto if using blueprint) |

Do **not** set `NEXT_PUBLIC_*` for the LLM key. Never commit production secrets.

If Prisma cannot connect, append SSL to the URL (common with external URLs):

```text
?sslmode=require
```

**4. Seed production data (one time)**

Render Dashboard → your web service → **Shell**:

```bash
npm run db:seed
```

**5. Verify**

- `GET https://<your-app>.onrender.com/api/health` → `{ "status": "healthy" }`
- Open `https://<your-app>.onrender.com/applications` → dashboard with seeded creators

### Render notes

- **Free tier:** Web services spin down after inactivity; first request may take ~30s.
- **Build:** `npm run build` runs `prisma generate && next build` (see `package.json`).
- **Migrations:** Applied at container start via `prisma migrate deploy`, not during build (DB must be reachable at runtime).
- **Logs:** Dashboard → Logs — check migration errors or missing `OPENAI_API_KEY` on review failures.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start production server (local) |
| `npm run start:render` | Migrate + start (Render start command) |
| `npm run db:push` | Apply schema (dev shortcut) |
| `npm run db:migrate:deploy` | Apply committed migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Prisma Studio |
