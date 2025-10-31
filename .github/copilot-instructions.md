# Focus Streak - AI Coding Agent Instructions

## Project Overview

A Next.js 16 (App Router) streak-tracking application with cross-device sync, Clerk authentication, and dual storage backends (Upstash Redis in prod, local file fallback in dev).

## Architecture & Data Flow

### Storage Strategy (3-Tier Reconciliation)

- **Client**: localStorage holds `streakData` with `{currentStreak, lastCheckInDate, goal, updatedAt}`
- **API Layer**: `/app/api/streak/route.ts` checks env vars in order: Upstash Redis → Vercel KV → local `data/streak.json`
- **Sync Logic**: On load, compare local vs remote by `updatedAt` timestamp; newest wins (`components/streak-counter.tsx` lines 37-106)

### User Identity Model

- **Signed out**: Auto-generated UUID in localStorage (`ds_userId`) via `lib/api.ts::getOrCreateUserId()`
- **Signed in**: Clerk `user.id` replaces anonymous ID, enabling cross-device sync
- Authentication is optional locally (works without Clerk env vars)

### State Management Pattern

All components use `useState` + `useEffect` with a **mounted guard**:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
if (!mounted) return null; // Prevents hydration mismatches
```

This pattern appears in `page.tsx`, `streak-counter.tsx`, `dark-mode-toggle.tsx`, `streak-history.tsx`.

## Key Technical Decisions

### Styling & Theming

- **Tailwind v4** with custom OKLCH color system in `app/globals.css` (sage green/warm clay palette)
- Theme toggle uses vanilla DOM manipulation (not next-themes provider) in `dark-mode-toggle.tsx`
- `@custom-variant dark (&:is(.dark *))` for dark mode support
- All UI components from shadcn/ui (Radix primitives) in `components/ui/`

### Path Aliases

`@/*` maps to project root (tsconfig.json), so imports use `@/components/`, `@/lib/`, etc.

### Build Configuration

- TypeScript errors intentionally ignored in production (`next.config.mjs`: `ignoreBuildErrors: true`)
- Images unoptimized for static export compatibility

## Development Workflows

### Local Setup

```bash
pnpm install
pnpm dev  # Runs on http://localhost:3000
```

### Environment Variables (optional locally, required in prod)

```bash
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Upstash Redis (without these, API falls back to data/streak.json)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Common Modifications

- **Goal options**: Edit `goalOptions` array in `components/streak-counter.tsx` (line 36)
- **Color scheme**: Modify OKLCH values in `app/globals.css` `:root` and `.dark` blocks
- **Motivational quotes**: Update array in `components/motivational-quote.tsx`

## Critical Implementation Details

### Streak Calculation Logic

Located in `components/streak-counter.tsx::handleCheckIn()`:

- If last check-in was yesterday → increment streak
- If last check-in was earlier → reset to 1
- Uses `Date.toDateString()` for timezone-safe day comparison

### API Route Persistence

`app/api/streak/route.ts`:

- GET checks Redis, then KV, then file
- POST upserts to whichever backend is available
- File storage uses `data/streak.json` with `{records: StreakRecord[]}`

### History Tracking

`components/streak-history.tsx` logs daily snapshots to localStorage (`streakHistory`, max 30 entries), separate from main `streakData` object.

## Component Dependencies

- All interactive components are `"use client"` directives
- Clerk components (`SignedIn`, `UserButton`) only in `app/page.tsx`
- `useUser()` hook from Clerk only imported in `streak-counter.tsx` for sync logic

## Testing & Validation

No formal test suite. Manual verification:

1. Check streak continuity across page refreshes (localStorage persistence)
2. Sign in/out to verify Clerk identity switching
3. Test with/without Upstash env vars to confirm fallback behavior

## Deployment Specifics

- Target: Vercel (framework preset: Next.js)
- Requires all 4 env vars in production (Clerk + Upstash)
- `@vercel/analytics` included in layout.tsx for tracking
