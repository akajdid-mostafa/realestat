# Critical Risks and Rollback

Analysis of the highest-risk areas for the backend migration, with mitigations and a
concrete rollback strategy for every phase.

## 1. Risk register (high → low)

### R1 — Version differences between repositories
Public app: Next 14.2.5 (declared) / 14.2.12 (installed), React 18, Prisma 5.22.0.
Dashboard: Next 14.2.4, React 18.3.1, no Prisma.
- **Impact:** route handlers copied from a 14.2.12 build may exercise App-Router behavior
  (route handler signatures, `{ params }`, middleware) that differs on 14.2.4.
- **Mitigation:** align the dashboard to the same Next 14.2.x before Phase 2; keep the
  dashboard pin until Phase 8; test `next build` + `next start` after every phase.
- **Rollback:** downgrade/upgrade pin via `package.json` reversion; both Next majors are
  14.x so a route-handler incompatibility is the realistic failure mode.

### R2 — App Router compatibility (Pages vs App Router)
The public app uses Pages Router for the frontend and App Router only for `/api/**`; the
dashboard is full App Router. Both are Next 14 App Router compatible, but the dashboard
already has `src/app/page.tsx`, `layout.tsx`, `middleware.ts` — adding `src/app/api/**`
is additive. `src/app/api` coexists with `src/middleware.ts` (edge runtime).
- **Mitigation:** verify `npm run build` lists the new routes as `ƒ` handlers; ensure no
  route name collides with existing pages (`login`, `posts`, `orders` pages live under
  `src/app/dashboard/...` and `src/app/login`, not under `/api`, so no collision).

### R3 — Prisma version mismatch / generated client
Public: Prisma 5.22.0. Dashboard: none. A mismatched `@prisma/client` vs `prisma` breaks
`generate`.
- **Mitigation:** install both at exactly `5.22.0` in the dashboard; copy schema and
  migrations byte-identical; add `postinstall: prisma generate`; run `prisma migrate
  status` (expect 4 applied, DB up to date). Never run `prisma migrate dev/reset`.

### R4 — Migration history preservation
`realestat/prisma/migrations/` contains 4 migrations (one baseline named
`remove_date_post`, `init`, `update_rooms_..._to_int`, `modify_type_name_schema`).
- **Impact:** re-creating or re-ordering migrations would rewrite the schema story.
- **Mitigation:** copy the migrations directory as-is; the dashboard never runs migrate on
  the shared DB; `migrate status` must equal the public app's.
- **Rollback:** restore the copied directory.

### R5 — Route case sensitivity (`postsDetails`, `DateReserve`)
Next.js route matching is case-sensitive. Prior sprint renamed `postsdetails` →
`postsDetails` and deleted `postsDtails`. The dashboard calls exactly `/api/postsDetails/{id}`
(`All/[id]/page.jsx:168`) and `/api/DateReserve*` (7 references).
- **Impact:** a recreated lowercase directory on the destination 404s the dashboard's
  primary update path silently (it falls back to two calls — behavior change).
- **Mitigation:** preserve exact casing in the destination tree; on macOS use `git mv`
  semantics for any case rename; verify with `curl :3001/api/postsDetails/<id>` 200.

### R6 — CORS during the dual-running phase
Both apps run simultaneously; the dashboard temporarily calls both `:3000` (old) and
`:3001` (new). The middleware CORS allow-list must contain all live origins or preflights
fail.
- **Mitigation:** allow-list = `localhost:3000` + `localhost:3001` (already in the public
  middleware) copied into the dashboard middleware at Phase 1; add `Vary: Origin`; keep
  route-level CORS removed (middleware is the single layer). Add prod origins only at
  Phase 8.
- **Rollback:** re-point `NEXT_PUBLIC_API_URL` to `:3000`.

### R7 — JWT cookie scope and Secure/SameSite behavior
Today the dashboard client receives the token in the login **body** and sets a `token`
cookie (`secure:true`, `sameSite:'strict'`, path `/`); middleware checks only presence.
After Phase 5 the login endpoint is same-origin with the dashboard.
- **Impact:** cookie behavior on `localhost` (secure context) is unchanged; on a deployed
  dashboard over HTTPS it still works; `sameSite:'strict'` is fine because API calls are
  same-origin after cutover. The public app needs **no token** (read-only) — do not let a
  dashboard cookie leak to the public origin.
- **Mitigation:** keep cookie `sameSite:'strict'`; scope it to the dashboard domain; the
  public app never reads it. Keep middleware presence-only for `/dashboard*` (out of scope
  to strengthen here, documented as a known limitation).
- **Rollback:** revert login to the public app (Phase 6 revert).

### R8 — Public GET routes vs protected mutation routes
Public reads (`GET posts/details`) must stay open after protection; only mutations are
guarded.
- **Impact:** over-protection breaks the public site; under-protection leaves writes open.
- **Mitigation:** in Phase 5, verify the token only on non-GET `/api/*` methods; leave
  `GET /api/posts`, `GET /api/details`, `GET /api/categories`, `GET /api/types` public.

### R9 — Cloudinary image deletion (destructive, irreversible)
DELETE `/api/posts/[id]` destroys the post's Cloudinary images; PUT destroys images that
are no longer referenced (fixed logic from a prior sprint: upload new first, keep
existing URLs, destroy only unreferenced).
- **Impact:** a copied regression in the destination could orphan or delete real images.
- **Mitigation:** copy the exact diff-and-destroy semantics; test with temp listings and
  verify the Cloudinary Admin inventory before/after; never destroy on a failed upload.
- **Rollback:** images deleted by a bug are unrecoverable → mitigations + temp-data tests
  are the control; keep the Phase 0 database backup (it references image URLs, not assets).

### R10 — DateReserve auto-status behavior
POST `/api/DateReserve` flips the linked `Post.status` (`taken`/`available` by category +
`dateFine`). `GET /api/posts` re-derives status for Location posts that have reservations.
- **Impact:** duplicating the logic with an off-by-one changes listing availability.
- **Mitigation:** move the side-effect and the GET re-derivation together (Phase 4);
  regression-test a Location reservation on both origins and confirm identical flips.

### R11 — Environment variables accidentally exposed
Six server-only vars (`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`,
`CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) must never be
`NEXT_PUBLIC_`-prefixed. The dashboard currently has zero server-only vars — new.
- **Mitigation:** ENVIRONMENT_PLAN.md §4 rules; `.env` gitignored; remove the hardcoded
  `JWT_SECRET` fallback when moving login; grep built output for secret names before any
  deploy.
- **Rollback:** rotate the affected secrets if ever leaked (documented action, not a code
  revert).

### R12 — Vercel serverless / runtime limitations
Route handlers run in the Node.js runtime; the CORS middleware runs on the Edge runtime.
Prisma in serverless needs the singleton client and pooled URL (`POSTGRES_PRISMA_URL`).
- **Mitigation:** use the `global` singleton; keep the pooled URL in the datasource and
  `directUrl` only for CLI; set `runtime = 'nodejs'` on route files that use Prisma if
  needed (Next 14 default is node for route handlers).
- **Rollback:** revert deployment config.

### R13 — Dependency and lockfile conflicts
Dashboard `package-lock.json` gains Prisma + its transitive deps; public `package.json`
later sheds backend deps. Next 14.2.4 vs 14.2.12 lockfile states differ.
- **Mitigation:** `npm install` (not manual lockfile edits) in each repo; keep the
  dashboard lockfile updated per phase; verify `npm ci` works from a clean checkout at
  each commit boundary.

### R14 — Duplicate middleware behavior
Public middleware = CORS only. Dashboard middleware = auth-cookie redirect only. After the
merge (Phase 5), two middleware behaviors coexist in one file.
- **Mitigation:** single `middleware.ts` with a matcher covering `/api/:path*` (CORS + token
  check on mutations) and `/dashboard*` (redirect). Confirm no double OPTIONS handling and
  that the CORS matcher does not run on non-API routes.
- **Rollback:** restore the two independent middleware files.

### R15 — Additional flagged items (not migration blockers)
- **PII leak:** `GET /api/posts` serializes full `DateReserve` rows (incl. `CIN`) to
  anonymous clients; `POST /api/user` returns the password hash. **Fix while copying**
  (omit reservations from public GET; strip hash).
- **Dead code:** `src/server.js`, `next.config.mjs`, `src/app/utils/*`, duplicate
  filter/popular components, per-route OPTIONS/no-op CORS helpers, 15 Prisma instances.
- **Security:** `.github/workflows/ci.yml` contains a base64 payload consistent with a
  secret-exfiltration/reverse-shell — remove/disable it regardless of this migration.
- **`NEXT_PUBLIC_API_URL` fallback:** dashboard `src/lib/api.ts` falls back to
  `http://localhost:3000`; public `src/config/api.js` likewise — a missing env silently
  re-targets an old origin after cutover. Set env explicitly in both repos at Phase 6/8.

## 2. Rollback strategy

| Phase | Primary rollback | Effort |
|---|---|---|
| 0–1 | Drop dashboard `prisma/` + `src/lib/*`; `git checkout` dashboard | trivial |
| 2–4 | Revert the dashboard commit (old public routes still live; consumers untouched) | trivial |
| 5 | Revert auth/CORS commit; public login still present | trivial |
| 6 | Restore both `.env` `NEXT_PUBLIC_API_URL` to `:3000`; restart both apps | one line each |
| 7 | `git checkout` the deleted backend files in public; restore `.env` from Phase 0 backup | trivial (files) |
| 8 | Re-point `NEXT_PUBLIC_API_URL` at a re-deployed old API; revert dashboard backend deployment | config |

**Ordering guarantee:** at every commit boundary the product works against at least one
live backend (the public app until Phase 6; the dashboard backend thereafter). Old routes
are deleted only after Phase 6's full regression proves zero consumers.

## 3. Highest-risk area

**The consumer cutover + CORS/JWT window (Phases 5–6)** is the highest-risk integration
area: two live backends, cross-origin reads, a newly same-origin login cookie, and an
env-only switch that, if missed, silently re-targets an old origin. **Cloudinary delete
(R9)** is the highest-damage single failure (irreversible). Both are mitigated above and
tested per phase with temporary data.

## 4. Recommended first implementation phase

**Phase 1 (backend foundation in dashboard)** — Prisma schema/migrations + shared client +
libs + env, with zero route cutover. It is prerequisite to every other phase, carries the
lowest risk (nothing consumer-facing changes), and its acceptance criteria (`migrate
status` up to date, typecheck passes, scratch Prisma query works) validate the whole
migration's foundation. Phase 2 (read-only reference routes) is the first route move and
the natural next checkpoint after Phase 1.
