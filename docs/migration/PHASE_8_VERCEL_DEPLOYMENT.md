# Phase 8 — Vercel Production Cutover

**Status:** **BLOCKED** — local build/security work complete; production
deployment blocked on (1) access to the production Vercel account and (2) secret
rotation by the user.
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main)
**Public repo:** `realestat` (master)

## 1. Production topology (target)

```
Public app (realestat, frontend-only)
  └─ API: dashbord-realstat backend (Vercel, Node runtime)
       ├─ Prisma/PostgreSQL (Neon, pooled URL at runtime)
       ├─ JWT auth (server-only JWT_SECRET)
       ├─ Cloudinary mutations (server-only credentials)
       └─ CORS allow-list: public origin + dashboard origin + localhost
Contact form → external https://email-fawn-alpha.vercel.app (unchanged)
WhatsApp/share links → public site origin (NEXT_PUBLIC_SITE_URL)
```

## 2. Project / domain mapping (verified from live deployments)

| Role | Domain | Verified behavior |
| --- | --- | --- |
| Public frontend | `https://realestat-eight.vercel.app` | GET `/` → 308 `/Index` (200); `/Index`, `/properties` 200; **still serves `/api/posts` 200 → stale pre-Phase-7 build** |
| Dashboard/backend | `https://dashbord-realstat-chi.vercel.app` | GET `/` → 307, `/login` 200; **no `/api/*` → stale pre-migration build** |
| Contact API | `https://email-fawn-alpha.vercel.app` | 200 |

Both production deployments are **stale** and must be redeployed from the final
commits.

> **Account access blocker.** The production domains are **not** owned by any
> Vercel scope available to the configured CLI token (`vercel whoami` →
> `zakarya123j`; teams `dev-ocean`, `zakaria-baoualis-projects`, plus personal).
> `vercel inspect` for both domains fails under every accessible scope. The git
> remotes are under GitHub user `akajdid-mostafa`
> (`github.com/akajdid-mostafa/{realestat,dashbord-realstat}`), so the live
> projects are presumed to belong to that account's Vercel team. Env-variable
> configuration and redeployment **cannot be performed from this token**.

## 3. Environment variable names per Vercel project

Dashboard/backend project (server-only, never `NEXT_PUBLIC_`):
`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`, `CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Dashboard project (client):
`NEXT_PUBLIC_API_URL` = dashboard production origin,
`NEXT_PUBLIC_SITE_URL` = public production origin,
`NEXT_PUBLIC_OPENCAGE_API_KEY`, `NEXT_PUBLIC_LOG_LEVEL` (if still used).

Public project (frontend-only — must contain **no** DB/JWT/Cloudinary vars):
`NEXT_PUBLIC_API_URL` = dashboard production origin,
`NEXT_PUBLIC_SITE_URL` = public production origin,
`NEXT_PUBLIC_CONTACT_API_URL` = `https://email-fawn-alpha.vercel.app/api/realestat`.

Stale backend-only variables must be removed from the public Vercel project.

## 4. Secret rotation (see docs/security/ENV_SECRET_ROTATION.md)

- Public `.env` was committed in 24 historical commits (2024); most recent
  committed copy (`c2f62b8`) is scrubbed but 2024 copies carry real values.
- Dashboard `.env` existed in the initial commit only; untracked since `c3cb11e`.
- **PENDING:** Neon DB password, `JWT_SECRET`, Cloudinary key/secret, OpenCage
  key. Rotation requires provider dashboard/API actions by the user. No value was
  generated or printed by the agent.

## 5. CORS production origins

`dashbord-realstat/src/lib/cors.ts` allow-list now:

- `http://localhost:3000`, `http://localhost:3001` (kept for local)
- `https://realestat-eight.vercel.app`, `https://dashbord-realstat-chi.vercel.app`

Behavior: echoes only allowed origins (no `*` with credentials), methods
GET/POST/PUT/DELETE/OPTIONS, headers Content-Type/Authorization, OPTIONS → 204,
mutation protection preserved in `src/middleware.ts`, `Vary: Origin` set on
responses. **Vary note:** Next.js may override `Vary: Origin` on API responses
with its own RSC vary header (observed in Phase 6); browsers are unaffected — a
shared edge/CDN cache must be configured with `Vary: Origin` at the edge. No
broad `*.vercel.app` wildcard is used; preview origins are not allow-listed.

## 6. Local verification (complete)

| Check | Public `realestat` | Dashboard `dashbord-realstat` |
| --- | --- | --- |
| `npm ci` | PASS (frontend-only deps) | PASS (incl. `postinstall: prisma generate`) |
| `npm run typecheck` | — (JS app) | PASS |
| `npm run build` | PASS — 9 static pages, zero API routes | PASS — middleware + API routes `ƒ` |
| `npm run lint` | 25 errors / 2 warnings (baseline) | 18 errors / 6 warnings (baseline) |
| Secret scan (tracked files + bundles) | CLEAN | CLEAN (only env-var name refs / placeholder docs) |
| `.env` tracked | 0 files | 0 files |

Prisma schema/migrations: **unchanged** in both repos (no `migrate dev/reset/
seed` run; `migrate status` not run — no schema touched).

## 7. Commits created (not pushed)

| Repo | Commit | Contents |
| --- | --- | --- |
| `dashbord-realstat` | `ef748d5 chore: configure production backend origins` | `src/lib/cors.ts` (+2 prod origins), `env.example` (names/comments), `.gitignore` |
| `realestat` | `aabbaf7 chore: remove tracked environment files` | `.gitignore` explicit env coverage |
| `realestat` | (pending) `docs: record Vercel production cutover` | this file + `docs/security/ENV_SECRET_ROTATION.md` |

No `.env` or secret value is in any commit. **Push is withheld** until secret
rotation and the production-Vercel access blocker are resolved and the staged
secret scan is re-confirmed clean.

## 8. Production smoke tests

**Not yet executed** (deployments not triggered). Planned matrix:

- Dashboard/backend: `/login` loads; invalid login 401; `/dashboard` redirects
  without token; authenticated `/dashboard` loads; `GET /api/posts|details|
  categories|types|DateReserve`; no-token mutation 401; CORS from public origin;
  unknown origin no ACAO; one temporary listing+detail+reservation lifecycle
  (temp image, update preserving image, delete, Cloudinary cleanup, baseline
  restored).
- Public: `/`, `/Index`, `/properties`, `/gallery`, `/service`, `/contact` 200;
  listings load from dashboard production API; filters/search/details/images/map;
  no reservation PII in responses; WhatsApp uses production site URL; contact
  posts to external API; `/api/posts` on public domain → 404; no request to the
  old production backend origin.

## 9. Rollback

- Reassign the previous successful Vercel deployment aliases (dashboard and
  public independently).
- Revert `ef748d5` if CORS must be restored to localhost-only.
- Restore prior env configuration; use rotated credentials (old ones are revoked).
- Neon PITR/backup only if data changes unexpectedly.
- Public and dashboard deployments roll back independently.

## 10. Final verdict

**BLOCKED.** Local verification is complete and the CORS/env commits are ready,
but production deployment cannot proceed until the user:

1. Provides access to the Vercel account owning `realestat-eight.vercel.app` /
   `dashbord-realstat-chi.vercel.app` (login/token/scope), or confirms the
   intended production projects under the accessible account.
2. Rotates the exposed secrets (Neon DB password, `JWT_SECRET`, Cloudinary
   key/secret, OpenCage key) and updates the dashboard Vercel env + local `.env`
   to the new values only.
