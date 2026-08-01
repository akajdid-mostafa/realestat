# Sprint 1.1 — Authentication Verification and Stable Checkpoint

**Date:** 2026-08-01
**Scope:** Verify the complete local authentication flow end-to-end and create one clean local Git checkpoint commit in each repository. No push. No schema/migration/seed changes.

## Repositories / ports

| App | Repository | Local URL | Role |
|---|---|---|---|
| Public site / API | `/Users/ocean_dev2/Projects/realestat` | `http://localhost:3000` | Owns REST API, Prisma, PostgreSQL, login endpoint |
| Admin dashboard | `/Users/ocean_dev2/Projects/dashbord-realstat` | `http://localhost:3001` | Consumes the public API |

## Login endpoint

`POST http://localhost:3000/api/login` (`src/app/api/login/route.jsx`)

- Body: `{ email, password }`
- Valid: HTTP 200, returns `{ token, user: { email } }` (JWT, HS256, `exp` = 1h, claim `userId`).
- Invalid: HTTP 401, `{ error: "Invalid email or password" }`, no token. Identical message for unknown email and wrong password (does not reveal which part failed).

## Token storage mechanism

- Client-side cookie written by `src/app/login/page.tsx` via react-cookie `setCookie('token', token, { path: '/', secure: true, sameSite: 'strict' })`, then `router.push('/dashboard')`.
- Cookie name: `token`. Path: `/`. Not HttpOnly (JS-readable by design of the current flow). SameSite `strict`, Secure. No `expires`/`max-age` — session cookie (browser lifetime), but the JWT itself expires after 1h.
- On `http://localhost`, modern browsers treat the origin as a secure context, so the `Secure` cookie is accepted.
- Dashboard middleware (`src/middleware.ts`) guards `/dashboard*` and redirects to `/login` when the `token` cookie is absent.

## Verified results

### Valid login
- `POST /api/login` with the existing admin credentials → HTTP 200, token present (3 JWT segments, HS256, `exp`/`iat` claims present).
- CORS: response includes `Access-Control-Allow-Origin: http://localhost:3001`; preflight `OPTIONS` from `:3001` → 200.
- Dashboard flow: valid token cookie → `/dashboard` → 200; `/dashboard/orders` → 200.

### Invalid login
- Wrong password → HTTP 401, no token, generic message.
- Unknown email → HTTP 401, no token, identical generic message (no user enumeration).
- Login page: on `!response.ok` throws before reading the body, sets an error alert, and does **not** navigate — no false success. Credentials never appear in the URL or in response logs.

### Refresh persistence
- Simulated repeat request with the same cookie (`/dashboard` twice) → 200 both times (session survives refresh).
- Cookie is stored at path `/` and is JS-readable; on reload the middleware reads the same `token` cookie, and the dashboard's data requests to the public API continue to work (public API is unauthenticated; CORS verified).

### Protected routing
- **No token:** `/dashboard` and `/dashboard/orders` → HTTP 307 redirect to `/login`.
- **Valid token:** `/dashboard` and `/dashboard/orders` → HTTP 200.
- **Malformed token** (`token=not.a.real.jwt`, and a token with an invalid signature): → HTTP 200. The middleware checks only **cookie presence**, not JWT signature or expiry. Documented as a known security issue for the future security sprint; not modified in this sprint because it does not block normal login.

### Logout
- `src/components/dashboard/layout/main-nav.tsx`: `Cookies.remove('token')` (js-cookie 3.0.5) then `router.refresh()`.
- js-cookie 3.0.5 defaults removal to `{ path: '/' }`, which matches the path the login cookie was written with, so the token cookie is actually cleared.
- After logout, protected-route requests carry no token → middleware redirects to `/login` (verified via the no-token state). No stale authenticated state remains on server refresh.

## Regression (Sprint 1 health)

- Public `/api/posts`, `/api/categories`, `/api/types` → 200.
- Public `/Index`, `/properties` → 200.
- CORS: `Origin: http://localhost:3001` → allow-origin echoed; `Origin: http://evil.example` → no allow-origin header.
- No `realestat.vercel.app` references remain in either `src/`.
- No data mutation performed during this sprint.

## Minimal fixes

None required. The existing flow completed end-to-end with no blockers:
- Login URL correct (`${API_BASE_URL}/api/login`).
- Token stored with path `/`; middleware reads the same `token` name; logout clears the same cookie (js-cookie default path `/`).
- Redirect target `/dashboard` exists.

## Build / lint / typecheck

- Public: `npm run lint` → 25 pre-existing errors (all in untouched files; none introduced by this sprint); `npm run build` → PASS.
- Dashboard: `npm run lint` → 22 pre-existing errors (none introduced); `npm run typecheck` → PASS; `npm run build` → PASS.
- No source files were changed in Sprint 1.1, so no new lint failures are possible.

## Unresolved security limitations (future security sprint)

- Dashboard middleware performs token **presence-only** checks: malformed, expired, or wrongly-signed JWTs are still accepted for `/dashboard*`.
- Hardcoded `JWT_SECRET` fallback in `src/app/api/login/route.jsx` (pre-existing; out of scope).
- Token stored client-side in a JS-readable cookie (no HttpOnly). `secure: true` limits login to secure contexts (localhost is treated as secure by modern browsers).
- No roles/authorization layer, no refresh-token rotation, no account lockout (out of scope).

## Commit review

- Staged files for both repos are the Sprint 1 source/config/example/docs changes only.
- `.env`, `.env.local` and all other local env files are gitignored and untracked in both repos — no secret-bearing files staged.
- No build output, logs, or temp files staged.
- Commit identity uses the configured global Git identity.

## Commits

- Public `realestat`: `chore: stabilize local real estate integration` — commit hash recorded in the sprint final report (this file lives in the public repo, so its own hash cannot be embedded without a stale self-reference).
- Dashboard `dashbord-realstat`: `chore: stabilize dashboard API integration` — `cf5bdd840ee247a8c04289f5b1352300a3878a20`.

## Confirmation

No secrets were printed, stored, or committed. No migration, seed, database reset, or push was performed.
