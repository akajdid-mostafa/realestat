# Phase 4 — Authentication, JWT, Route Protection, CORS

**Status:** READY FOR PHASE 5
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main) — will be committed as `feat: move auth and protect backend mutations`
**Source of truth:** `realestat` (master) `src/app/api/login/route.jsx` + `src/middleware.ts` CORS layer

> **Phase numbering note.** `MIGRATION_PHASES.md` labels this work "Phase 5
> (Authentication, JWT, route protection, CORS)" and "Phase 4 (Reservations)".
> Per the current execution plan, the auth/security work was executed first and is
> recorded here as **Phase 4 (auth/security)**; the `DateReserve` reservation work
> is deferred and will follow as the next phase. Nothing else changed — the work
> itself matches the Phase-5 goals in `MIGRATION_PHASES.md` exactly.

## Scope

Moved auth into the dashboard backend on `:3001`:

- `POST /api/login` now exists on the dashboard and issues JWTs.
- The dashboard's middleware now guards its own `/api/*` mutation methods
  (POST/PUT/DELETE, except `POST /api/login`), serves CORS for both app origins,
  and keeps the existing `/dashboard/*` cookie-based page guard.
- Dashboard mutation callers attach the `Authorization: Bearer <token>` header
  (from the `token` cookie) so the UI keeps working against `:3001`.

Consumers remain on `NEXT_PUBLIC_API_URL=http://localhost:3000`; **no consumer
cutover**. The old public `login` route and all public `/api/**` routes remain in
`realestat` untouched.

### Files (dashboard)

| File | Change |
| --- | --- |
| `src/app/api/login/route.ts` | new — `POST /api/login` (bcryptjs + `signToken`) |
| `src/middleware.ts` | rewritten — API CORS + mutation protection + dashboard guard |
| `src/lib/auth.ts` | rewritten — Web Crypto HS256 sign/verify (Edge-safe) |
| `src/lib/api.ts` | extended — `getToken`, `authHeaders`, `apiHeaders`, `apiFetch` |
| `src/contexts/post.jsx` | adds axios request interceptor (Bearer from cookie) |
| `src/app/dashboard/insert/page.jsx` | `fetch` → `apiFetch` for `POST /api/posts` |
| `src/app/dashboard/posts/page.jsx` | `fetch` → `apiFetch` for `DELETE /api/posts/[id]` |
| `src/app/dashboard/update/[id]/page.jsx` | `fetch` → `apiFetch` for `PUT /api/posts/[id]` |
| `src/app/dashboard/show/[id]/page.jsx` | `fetch` → `apiFetch` for `DELETE /api/posts/[id]` |
| `src/app/dashboard/All/[id]/page.jsx` | `fetch` → `apiFetch` for `postsDetails/posts/details` mutations |
| `src/lib/cors.ts` | unchanged — allow-list `http://localhost:3000`, `http://localhost:3001` |
| `src/lib/validation.ts`, `src/lib/prisma.ts` | unchanged (reused) |

`package.json`: added `bcryptjs@^3.0.2` (`compare` API-compatible with the
public `^2.4.3`). No other runtime deps added.

## Behavior

### Login (`POST /api/login`)

- Request body `{ email, password }`.
- Looks up the user by email, compares the bcrypt hash, issues a JWT via
  `@/lib/auth` (HS256, 1h expiry, payload `{ userId, iat, exp }`).
- Success → `200 { token, user: { email } }` (no password, no hash).
- Unknown email and wrong password → identical generic `401 { error: 'Invalid email or password' }`
  (no user enumeration).
- Missing/invalid body fields → `401` same generic message.
- Unhandled errors → `500 { error: 'Error logging in' }`; only the error message
  is logged, never credentials or tokens.

### Middleware (`src/middleware.ts`)

- `matcher: ['/api/:path*', '/dashboard/:path*']`.
- **API routes:**
  - `OPTIONS` → `204` with CORS headers (preflight).
  - `GET`/`OPTIONS` → public (CORS headers added).
  - `POST /api/login` → public.
  - All other `POST`/`PUT`/`DELETE` → require a valid JWT.
  - Token sources, in order: `Authorization: Bearer <token>` header, then the
    `token` cookie (both supported for the dual-running transition).
  - Missing/malformed/forged/expired token → `401 { error: 'Unauthorized' }`.
- **Dashboard pages:** `/dashboard*` requires a valid `token` cookie; missing,
  malformed, forged, or expired → `307` redirect to `/login`; valid → `200`.
- **CORS:** `@/lib/cors` — `Access-Control-Allow-Origin` echoes the allowed
  origin only (`:3000`/`:3001`), `Vary: Origin` (present on middleware-owned
  responses such as preflight; Next.js overwrites `Vary` with its own
  RSC/Navigation values on proxied route responses — framework behavior, the
  allow-origin/methods/headers still flow through), methods
  `GET, POST, PUT, DELETE, OPTIONS`, headers `Content-Type, Authorization`.
  Unlisted origins get no `Access-Control-Allow-Origin` header; mutations from
  unlisted origins still `401`.
- No CORS helpers were added at the route level (routes stay CORS-free; the
  middleware is the single source).

### Dashboard client auth transport

- `src/lib/api.ts` adds `getToken()` (reads the `token` cookie),
  `authHeaders()` (`Authorization: Bearer`), `apiHeaders()`, and `apiFetch()`
  (sets `Content-Type` + `Authorization`).
- `src/contexts/post.jsx` registers a single axios request interceptor
  (module-guarded) that attaches the Bearer header to all axios calls
  (orders/`DateReserve` reads included) — no per-call edits needed.
- All dashboard mutation pages now use `apiFetch`, so every mutation carries the
  token once the user is logged in.

## Intentional deviations (documented)

1. **Web Crypto HS256 instead of `jsonwebtoken`** (`src/lib/auth.ts`). The
   middleware runs on the Edge runtime; `jsonwebtoken` cannot be bundled for
   Edge. The rewrite is standard JWT HS256 (three base64url segments, `iat`/
   `exp` claims) with the same `signToken`/`verifyToken` interface —
   `signToken` is now async (`Promise<string>`). Verified interoperable:
   payloads/`exp-iat` match the public route's output.
2. **No hardcoded secret fallback.** The public `login` route carries a
   hardcoded `JWT_SECRET` fallback; the dashboard version is env-only and throws
   at boot/use if `JWT_SECRET` is missing. That fallback was **not** replicated.
3. **Secret never in client bundles.** Verified `JWT_SECRET` value absent from
   `.next` output (auth code is server-only via the middleware + route).
4. **Route params via `{ params }`** and shared `@/lib/prisma` singleton — no
   new `PrismaClient` instance.

## Verification

- `npm run typecheck` and `npm run build` pass on the dashboard (build output
  includes `/api/login` and the Edge `Middleware`); public `npm run build`
  passes; public tree is byte-for-byte untouched (clean).
- Login parity: old `:3000` and new `:3001` both return `200 { token, user }`
  with 3-segment HS256 tokens, identical claims (`userId, iat, exp`,
  `exp - iat = 3600`), and no `password` field. Wrong password and unknown email
  both → identical generic `401` on both servers.
- Mutation protection matrix (35/35 pass) against the live `:3001` server:
  - Public `GET` on `/api/posts`, `/api/details`, `/api/categories`,
    `/api/types` → `200`; `POST /api/login` → `200`.
  - No token / malformed / forged / expired for every mutation method
    (`POST /api/posts`, `PUT /api/posts/1`, `DELETE /api/posts/1`,
    `POST /api/details`, `PUT /api/details/1`, `PUT /api/postsDetails/1`)
    → `401 { error: 'Unauthorized' }`.
  - Valid token passes the middleware into route logic (`400`/`404` from the
    route handlers).
- Dashboard page protection: no token / malformed / forged / expired cookie
  → `307` redirect to `/login`; valid cookie → `200` on `/dashboard` and
  `/dashboard/orders`; repeated requests stay `200` (session persists);
  `/login` page public.
- UI-equivalent login flow on `:3001`: `POST /api/login` → token → set as
  `token` cookie → `/dashboard` `200`; cookie-only API call (no Bearer header)
  → `200`; clearing the cookie → `307` to `/login` (simulates logout).
- CORS: `OPTIONS` from `:3000`/`:3001` → `204` with echoed
  `Access-Control-Allow-Origin`, methods, headers, `Vary: Origin`; unknown
  origin → no allow-origin header and mutations still `401`; exactly one
  `access-control-allow-origin` header on responses (no duplication).
- DB before/after identical: 9 posts / 6 details / 2 categories / 6 types /
  0 DateReserve / 1 user; no rows created by tests.
- `npm run lint`: same pre-existing errors/warnings as the Phase 2/3 baseline;
  none in the new/modified auth files. Prettier clean on the new/rewritten
  files (`login/route.ts`, `middleware.ts`, `lib/auth.ts`, `lib/api.ts`);
  pre-existing files were failing `prettier --check` at HEAD already and were
  left unformatted to keep the diff minimal.
- No secrets/credentials in `.next` bundles; no password/token strings in dev
  logs; no `console.log` of credentials/tokens in auth files.
- No `DateReserve` routes moved (dashboard still has no reservation routes);
  `NEXT_PUBLIC_API_URL` still `http://localhost:3000`; old `:3000` `login` route
  intact and returning `200`.

## Out of scope

- Reservations (`DateReserve`) mutation routes (deferred — next phase).
- `GET /api/user` and any user-registration routes.
- Consumer cutover to `:3001` (Phase 6).
- OAuth, refresh tokens, roles, password reset.
- `HttpOnly` cookie (client reads the token; deferred).
- Deleting the old public `login` route or any public `/api/**` routes.

## Next

- Reservations (`DateReserve`) routes on the dashboard backend, then consumer
  cutover per `MIGRATION_PHASES.md`.
