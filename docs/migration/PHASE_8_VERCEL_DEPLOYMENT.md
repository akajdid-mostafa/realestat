# Phase 8 — Vercel Production Cutover

**Status:** **PRODUCTION READY** — every live check passes. Public production is
`https://realstat-eta.vercel.app`; it calls the new backend
`https://dashbord-realstat-two.vercel.app`; CORS, listings, search/filters/
detail, contact, and share links are all verified green.
**Date:** 2026-08-02 (updated)
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
| Public frontend | `https://realstat-eta.vercel.app` | `/` → 308 `/Index` → 200; `/Index`, `/properties`, `/gallery`, `/service`, `/contact` 200; `/api/posts`, `/api/login` on this domain → 404 (desired). Served bundles inline `dashbord-realstat-two.vercel.app` (API), `realstat-eta.vercel.app` (site), `email-fawn-alpha.vercel.app/api/realestat` (contact); no `realestat-eight`, no `dashbord-realstat-chi`, no localhost. |
| Dashboard/backend | `https://dashbord-realstat-two.vercel.app` | `/login` 200; `/dashboard` (and all sub-pages) 307 → `/login` without token, 200 with valid session; all 10 `/api/*` routes live; CORS + mutation auth verified. |
| Legacy public (retired) | `https://realestat-eight.vercel.app` | Obsolete alias still reachable but serves a stale build; no longer referenced by the served production bundles. |
| Legacy dashboard (retired) | `https://dashbord-realstat-chi.vercel.app` | **Dead** — `/api/posts` → 404. No longer in the CORS allow-list. |
| Contact API | `https://email-fawn-alpha.vercel.app` | External API; `GET /api/realestat` → 405 (POST-only). |

> **Account access note.** The production domains are **not** owned by any Vercel
> scope available to the configured CLI token (`vercel whoami` →
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
- `https://realestat-eight.vercel.app` (legacy alias, harmless)
- `https://dashbord-realstat-two.vercel.app`
- `https://realstat-eta.vercel.app`

**Final CORS fix (2026-08-02):** the allowed production origin was first added
with a trailing slash (`https://realstat-eta.vercel.app/`), which never matched
the browser-sent `Origin` header and so produced no `Access-Control-Allow-Origin`
response header. The fix removed the trailing slash (`commit b26b8c5`):
`'https://realstat-eta.vercel.app'`. A trailing-slash origin is invalid CORS
and must not be reintroduced.

Behavior: echoes only allowed origins (no `*` with credentials), methods
GET/POST/PUT/DELETE/OPTIONS, headers Content-Type/Authorization, OPTIONS → 204,
mutation protection preserved in `src/middleware.ts`, `Vary: Origin` set on
OPTIONS responses. **Verified live:** OPTIONS 204 (ACAO echoed only for
allow-listed origins), GET from public origin + localhost → 200 with matching
ACAO, trailing-slash variant and unknown origin → no ACAO, POST without/with
malformed/expired token → 401. **Vary note:** Next.js overrides `Vary: Origin`
on GET/POST API responses with its own RSC vary header (observed live); browsers
are unaffected, but a shared edge/CDN cache must be configured with
`Vary: Origin` at the edge. No broad `*.vercel.app` wildcard is used; preview
origins are not allow-listed.

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

## 7. Commits created

| Repo | Commit | Contents |
| --- | --- | --- |
| `dashbord-realstat` | `ef748d5 chore: configure production backend origins` | `src/lib/cors.ts` (+2 prod origins), `env.example` (names/comments), `.gitignore` |
| `dashbord-realstat` | `765aa64 chore: allow new production backend origin` | `src/lib/cors.ts` adds `dashbord-realstat-two` (pushed to `main`) |
| `dashbord-realstat` | `0543d4d mos` | `src/lib/cors.ts`: swap `dashbord-realstat-chi` → `realstat-eta.vercel.app` (**with** trailing slash — CORS bug) |
| `dashbord-realstat` | `b26b8c5 mos` | `src/lib/cors.ts`: remove the trailing slash from `realstat-eta.vercel.app` (final CORS fix) |
| `realestat` | `aabbaf7 chore: remove tracked environment files` | `.gitignore` explicit env coverage |
| `realestat` | `af8e8309 docs: record Vercel production cutover` | this file + `docs/security/ENV_SECRET_ROTATION.md` |

No `.env` or secret value is in any commit. The dashboard CORS fix is deployed
and live; the public repo has no code change pending.

## 8. Production smoke tests

**Executed 2026-08-02** against the live deployments. Results:

- Dashboard/backend (`dashbord-realstat-two`): `/login` 200; `POST /api/login`
  bad credentials → 401 (successful password login **not** executed — no valid
  credentials provided); `/dashboard` + `/dashboard/posts|orders|insert|settings|
  show/[id]|update/[id]` → 307 `/login` without token, **200 with a valid signed
  session token**; `GET /api/posts|categories|types|details` → 200; mutation
  without/with malformed/expired token → 401; CORS from public origin and
  localhost → 200 + matching ACAO; unknown origin → no ACAO; OPTIONS → 204.
- Temporary CRUD lifecycle (authenticated, against production): create post (1
  temp image, `id=23`) → 201; visible in public `GET /api/posts`; status change
  `available` → `unavailable` → `available`; combined `postsDetails` update
  (surface/rooms/bathrooms) persisted; reservation create/view/update/delete
  (`id=18`) all OK; listing delete → 200; Cloudinary image destroyed (404);
  production post count returned to **9**; no `VERIF-TEMP` residue.
- Security: secret/leak scan of all production JS bundles (public 21 chunks,
  dashboard 5 chunks) → **no** localhost, private keys, JWTs, DB URLs, or
  server secret names/values in client bundles.
- Public (`realstat-eta`): all pages 200; `/api/posts` on public domain → 404;
  served bundles inline `dashbord-realstat-two.vercel.app` (API),
  `realstat-eta.vercel.app` (site/share links), `email-fawn-alpha.vercel.app/api/
  realestat` (contact); no `realestat-eight`, no `dashbord-realstat-chi`, no
  localhost; listings (9) load with no reservation PII; search/filters/detail/
  images/map verified; loading/empty/error states present in the UI.

Not executed: successful password login (needs valid credentials); contact-form
email send (avoid sending a live test email).

## 9. Rollback

- Reassign the previous successful Vercel deployment aliases (dashboard and
  public independently).
- Revert `ef748d5` if CORS must be restored to localhost-only.
- Restore prior env configuration; use rotated credentials (old ones are revoked).
- Neon PITR/backup only if data changes unexpectedly.
- Public and dashboard deployments roll back independently.

## 10. Final verdict

**PRODUCTION READY.** Every live check passes on 2026-08-02:

- Public `https://realstat-eta.vercel.app`: all pages 200; served bundles inline
  `dashbord-realstat-two.vercel.app` (API), `realstat-eta.vercel.app` (site),
  `email-fawn-alpha.vercel.app/api/realestat` (contact); no obsolete
  `realestat-eight` / `dashbord-realstat-chi` / localhost references.
- Listings load (9 posts) from the new backend; search, category/type/city
  filters, property detail, images/gallery, and map (lat/lon) data verified;
  loading/empty/error states are honest; no reservation PII in public responses.
- CORS from `https://realstat-eta.vercel.app` → `https://dashbord-realstat-two.
  vercel.app/api/posts` → 200 with matching `Access-Control-Allow-Origin`;
  OPTIONS preflight 204; the trailing-slash origin no longer matches.
- Public `/api/posts` → 404 (no backend routes exposed on the public domain).
- Dashboard/backend, CORS/auth, CRUD lifecycle, Cloudinary cleanup, secret
  scans, builds, and typecheck previously verified green against production.

The two historical blockers are resolved: (1) the public API origin was
corrected to `dashbord-realstat-two.vercel.app` (Vercel env + redeploy), and
(2) the CORS allow-list entry was corrected to remove the trailing slash from
`https://realstat-eta.vercel.app`.

Non-blocking notes: successful password-login check not executed (no valid
credentials provided); contact-form email send not executed (avoid sending a
live email); secret rotation (Section 4) remains PENDING per the security doc.
