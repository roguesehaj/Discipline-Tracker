# Focus Streak by SB

Build unbreakable discipline with a simple daily check‑in streak.

## Features

- Daily check‑in with streak tracking and reset logic
- Goal selector with visual progress ring
- Recent activity history (last 10 entries)
- Light/Dark mode toggle
- Cross‑device sync via Upstash Redis
- Email sign‑in via Clerk (portable identity)

## Tech Stack

- Next.js 16 (App Router, React 19)
- Tailwind CSS v4, shadcn/ui + Radix
- Upstash Redis (HTTP) for storage in production
- Clerk for authentication

## Local Development

1. Install

```bash
pnpm install
```

2. Create `.env`

```bash
# Clerk (optional locally, required in prod)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Upstash (optional locally; required in prod for sync)
UPSTASH_REDIS_REST_URL=https://us1-example.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
```

Note: Without Upstash env vars locally, the API falls back to a file store at `data/streak.json`.

3. Run

```bash
pnpm dev
```

Open http://localhost:3000

## Sync model

- Signed out: a device‑local `userId` in localStorage is used and synced.
- Signed in (Clerk): your `user.id` is used so data follows you across devices.
- On load: local vs server is reconciled by `updatedAt` (newest wins).

## Deploy to Vercel

1. Import the repo in Vercel (framework: Next.js).
2. Add env vars:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Redeploy.

## Common edits

- Goal options: `components/streak-counter.tsx` (`goalOptions`)
- Theme/colors: `app/globals.css`
- UI primitives: `components/ui/*`

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```
