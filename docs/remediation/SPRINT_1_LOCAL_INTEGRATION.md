# Sprint 1 — Local Integration Stabilization

**Date:** 2026-08-01
**Scope:** Make the admin dashboard (`localhost:3001`) communicate reliably with the public app's REST API (`localhost:3000/api` → Prisma/PostgreSQL). No schema/migration changes, no seed, no commit/push, no UI changes.

## Architecture (local)

| App | Repo | Port | Role |
|---|---|---|---|
| Public site / API | `realestat` | `3000` | Next.js app + REST API (`src/app/api/**`), Prisma, PostgreSQL |
| Admin dashboard | `dashbord-realstat` | `3001` | Next.js client consuming the public API cross-origin |

## Environment variables

Safe, local-only values. Both repos:
- `NEXT_PUBLIC_API_URL=http://localhost:3000`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Public app only (documented as empty in `env.example`; request is skipped when unset):
- `NEXT_PUBLIC_CONTACT_API_URL=` (empty)

Secrets were NOT added to `env.example` and existing secret values were left untouched.

## Shared config modules

- Public app: `src/config/api.js` — exports `API_BASE_URL`, `SITE_BASE_URL`, `CONTACT_API_URL` with trailing-slash normalization and `http://localhost:3000` fallbacks.
- Dashboard: `src/lib/api.ts` — exports `API_BASE_URL` (env-resolved, normalized, `http://localhost:3000` fallback).

Import alias: public `@/*` → `./src/*` was added to `tsconfig.json` `compilerOptions.paths` (the existing `jsconfig.json` paths were being ignored because `tsconfig.json` takes precedence; the app had never used `@/` imports, so the alias was unregistered in webpack).

## Files modified

### Public app (`realestat`)
- `src/config/api.js` — NEW shared API config.
- `tsconfig.json` — added `paths` `@/*` → `./src/*`.
- `.env` — appended `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` (existing secret keys untouched).
- `env.example` — added the three `NEXT_PUBLIC_*` vars with docs.
- `next.config.js` — removed the legacy `async headers()` CORS block (`*` + credentials).
- `src/middleware.ts` — MOVED from `src/app/middleware.ts` (the `src/app` location is never loaded by Next). `allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']`, echoes the allowed origin only, no `Allow-Credentials`. Matcher `/api/:path*`. This is now the single active CORS layer.
- `src/app/api/{categories,categories/[id],types,types/[id],details,details/[id],posts,posts/[id],postsdetails/[id],postsDtails/[id],login}` — neutralized per-route `setCorsHeaders` (now no-ops) and inline OPTIONS header overrides so route handlers can't override the middleware's origin echo. 10 files.
- `src/components/properties/PropertyList.jsx` — API base URL from `API_BASE_URL`.
- `src/components/properties/PropertyDetailModal.jsx` — posts/details URLs from `API_BASE_URL`.
- `src/components/properties/PopularPropertyCard.jsx` — fetch URLs from `API_BASE_URL`; WhatsApp share link → `${SITE_BASE_URL}/properties?...`.
- `src/components/properties/popular-post.jsx` — fetch URLs from `API_BASE_URL`; WhatsApp share links → `SITE_BASE_URL`.
- `src/components/properties/PropertySumary.jsx` — WhatsApp share link → `SITE_BASE_URL`.
- `src/components/Index/ContactForm.jsx` — submit uses `${CONTACT_API_URL}/Email`; early `alert` failure when `CONTACT_API_URL` is empty (no false success).
- `src/components/properties/contact.jsx` — same guard + `${CONTACT_API_URL}/Email`.

### Dashboard (`dashbord-realstat`)
- `src/lib/api.ts` — NEW shared API config.
- `.env` — set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, appended `NEXT_PUBLIC_API_URL=http://localhost:3000` (secrets untouched).
- `env.example` — was empty (pre-existing untracked); populated with the three safe local vars only.
- `src/contexts/post.jsx` — all 11 axios base URLs → `${API_BASE_URL}` (this file already had pre-existing localhost overrides; now config-driven).
- `src/app/login/page.tsx` — POST → `${API_BASE_URL}/api/login`; token stored client-side via `setCookie`.
- `src/app/dashboard/OrderDialog.jsx`, `src/components/OrderActions.tsx` — `DateReserve` fetches → `${API_BASE_URL}`.
- `src/app/dashboard/updateorder/[id]/page.jsx`, `posts/page.jsx`, `posts/SearchPost.jsx`, `insert/page.jsx`, `update/[id]/page.jsx`, `show/Update.jsx`, `show/[id]/page.jsx`, `All/[id]/page.jsx`, `detail/[id]/page.jsx` — all `https://realestat.vercel.app` fetches → `${API_BASE_URL}`.

## CORS behavior (verified)

- `GET /api/posts` with `Origin: http://localhost:3001` → `Access-Control-Allow-Origin: http://localhost:3001`, methods, headers.
- Preflight `OPTIONS` from `3001` → 200 with the same headers.
- `Origin: http://evil.com` → no `Access-Control-Allow-Origin` returned.
- All `localhost:3000`/`realestat.vercel.app` references removed from `src/` except the two config modules (`src/config/api.js`, `src/lib/api.ts`), `src/middleware.ts`, `src/lib/get-site-url.ts`, and the dead Express stub `src/server.js` (pre-existing, left for Sprint 3).

## Verification results

- All pages compile and serve: `/Index`, `/properties`, `/gallery`, `/service`, `/contact` (200).
- API GETs return data: `/api/categories`, `/api/types`, `/api/posts` (8), `/api/details` (5).
- CRUD cycle (temp listing id=9, `SPRINT1_VERIFY_*` marker, deleted after):
  - CREATE `POST /api/posts` → 201, id=9; list 8 → 9.
  - READ `GET /api/posts?id=9` → found.
  - UPDATE `PUT /api/posts/9` → ville/prix persisted.
  - DELETE `DELETE /api/posts/9` → 200, list back to 8, `GET ?id=9` → 404.
- Login: `POST /api/login` with bad creds → 401 + CORS headers (DB + bcrypt path reachable). Successful login not tested — requires real admin credentials.

## Build / lint / typecheck

- Public: `npm run build` PASS; `npm run lint` reports 25 pre-existing errors (all in untouched files; none introduced by this sprint).
- Dashboard: `npm run build` PASS; `npm run typecheck` PASS; `npm run lint` reports 22 pre-existing errors (none introduced by this sprint).
- Both `next build` outputs include `ƒ Middleware`, confirming `src/middleware.ts` is bundled and active.

## Blockers / notes

- Dev servers were stale (broken `.next` chunk → HTTP 500). Restarted clean: public `:3000`, dashboard `:3001`.
- The public app's middleware previously lived at `src/app/middleware.ts`, which Next never loads — the app had NO working CORS layer; the per-route `Access-Control-Allow-Origin: *` + credentials headers were the de facto (broken for credentials) layer. Fixed by moving to `src/middleware.ts` and neutralizing per-route overrides.
- Contact-form endpoint (`NEXT_PUBLIC_CONTACT_API_URL`) is not configured locally; forms skip the request and surface the existing failure alert. Expected until Sprint 3.
- Pre-existing (out of scope, not changed): hardcoded `JWT_SECRET` fallback in `src/app/api/login/route.jsx`; dead Express stub `src/server.js`; `realestat.vercel.app` references outside `src/` (README, etc.); marketing mailto/Facebook links in `Footer.jsx`/`whatssap.jsx`.
- No migration, no seed/reset, no commit, no push performed.

## Pre-existing uncommitted changes (preserved, not authored by this sprint)

- Dashboard: `src/contexts/post.jsx` (already modified with localhost overrides before the sprint — now converted to use the shared config).
- Dashboard: `env.example` (untracked, was 0 bytes — now populated).
- Public: `docs/` (untracked, audit outputs from prior session).
