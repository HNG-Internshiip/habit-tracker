# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built for Stage 3 of the Frontend Wizards programme.

---

## Project Overview

Users can sign up, log in, create daily habits, mark them complete, track streaks, edit and delete habits, and install the app on their device. All state is persisted in `localStorage`. There is no remote backend or external auth service.

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate PWA icons (requires the `canvas` package)
npm install canvas --save-dev
node scripts/generate-icons.mjs

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Running the App

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

---

## Running Tests

```bash
# Unit tests only (with coverage report)
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires running dev server, handled automatically)
npm run test:e2e

# All tests in sequence
npm run test
```

Coverage reports are written to `./coverage/` after `test:unit`.  
The minimum threshold is **80% line coverage** for all files in `src/lib/`.

---

## Local Persistence Structure

All data is stored in `localStorage` under three keys:

| Key | Shape | Purpose |
|---|---|---|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Active session (who is logged in) |
| `habit-tracker-habits` | `Habit[]` | All habits for all users |

Habits are filtered on the client by `userId` so each user sees only their own data.  
See `src/types/auth.ts` and `src/types/habit.ts` for the exact type shapes.

---

## PWA Implementation

- **`public/manifest.json`** — declares the app name, icons, start URL, and display mode (`standalone`).
- **`public/sw.js`** — a network-first service worker that caches all shell assets on install and serves the cache when offline.
- The service worker is registered in `src/app/layout.tsx` via an inline `<script>` tag so it works with Next.js App Router without a third-party plugin.
- Icons at `public/icons/icon-192.png` and `public/icons/icon-512.png` satisfy the installability requirement.

---

## Trade-offs and Limitations

- **Passwords are stored in plain text** in `localStorage`. This is intentional per the TRD, which specifies no remote auth service and local-only persistence.
- **No token expiry.** Sessions persist until the user explicitly logs out.
- **Single frequency.** Only `daily` habits are supported (per TRD §12).
- **No server-side rendering for protected data.** Dashboard protection is client-side only, appropriate for a localStorage-backed app.
- **SW caching** uses a network-first strategy rather than a full offline SPA cache, which keeps it simple and avoids stale UI. The app shell is guaranteed to load offline after one visit.

---

## Test File Map

| File | Describe block | What it verifies |
|---|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Slug generation: lowercase, hyphenation, trimming, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` | Empty input rejection, 60-char limit, trimmed value on success |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Empty completions, today-not-complete, consecutive streaks, duplicate dedup, gap detection |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Add date, remove date, immutability, no duplicate dates |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Signup creates session, duplicate email error, login stores session, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | `habit form` | Empty name validation, create renders card, edit preserves fields, delete requires confirmation, toggle updates streak |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Full user journeys: splash, routing, auth, CRUD, persistence, logout, offline shell |

---

## Implementation Map (TRD Section → Code)

| TRD Section | Implementation |
|---|---|
| §4 Route Contract | `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/dashboard/page.tsx` |
| §5 Persistence Contract | `src/lib/storage.ts` |
| §7 Naming Conventions | All files follow PascalCase (components), camelCase (functions), lowercase (lib files) |
| §8 Type Contracts | `src/types/auth.ts`, `src/types/habit.ts` |
| §9 Utility Functions | `src/lib/slug.ts`, `src/lib/validators.ts`, `src/lib/streaks.ts`, `src/lib/habits.ts` |
| §10 UI Contract | `src/components/` — all `data-testid` values match the spec exactly |
| §11 Auth Behavior | `src/lib/auth.ts` |
| §12 Habit Behavior | `src/hooks/useHabits.ts`, `src/components/habits/HabitCard.tsx` |
| §13 PWA Contract | `public/manifest.json`, `public/sw.js`, `src/app/layout.tsx` |
| §16 Test Suite | `tests/unit/`, `tests/integration/`, `tests/e2e/` |
| §18 Package Scripts | `package.json` |# habit-tracker
