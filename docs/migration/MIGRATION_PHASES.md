# Migration Phases — Route-by-Route, Always Working

Every phase keeps the product working, has a rollback point, and ends at a commit
boundary in each repo. Phases move one domain at a time; the public app is switched only
after each route group is verified on the new origin; old routes are deleted only after
zero consumers remain.

Read `ROUTE_INVENTORY.md` for per-route detail and `RISK_AND_ROLLBACK.md` for the
mitigations referenced below.

---

## Phase 0 — Migration checkpoint (no code change)

**Goal:** verified starting point.

- **Exact files:** none (git state + DB backup).
- **Commands:**
  - `git -C /Users/ocean_dev2/Projects/realestat status --short` → clean (currently clean).
  - `git -C /Users/ocean_dev2/Projects/dashbord-realstat status --short` → clean (currently clean).
  - DB backup: `pg_dump "$POSTGRES_PRISMA_URL" -Fc -f backup_pre_migration.dump` (or the
    provider's snapshot) and verify it restores.
  - `cd realestat && npm run build` and `cd dashbord-realstat && npm run build` → both PASS (baseline).
- **Risks:** DB backup incomplete. **Mitigation:** verify dump with `pg_restore -l`.
- **Rollback point:** N/A (no change made).
- **Validation tests:** both builds pass; API smoke `GET /api/posts`, `GET /api/details`,
  `POST /api/login` (401 path) all behave as documented.
- **Commit boundary:** a checkpoint commit in each repo noting "pre-migration baseline".

---

## Phase 1 — Backend foundation in the dashboard (no route cutover)

**Goal:** the dashboard repo can compile and run the Prisma client and shared libs, but
exposes no `/api/*` yet that consumers use.

- **Exact files (copy, not move — dashboard side only):**
  - `realestat/prisma/schema.prisma` → `dashbord-realstat/prisma/schema.prisma`
  - `realestat/prisma/migrations/**` → `dashbord-realstat/prisma/migrations/**`
    (exact copy incl. `migration_lock.toml`; do NOT run `prisma migrate dev`)
  - NEW `dashbord-realstat/src/lib/prisma.ts` (singleton)
  - NEW `dashbord-realstat/src/lib/auth.ts`, `src/lib/cloudinary.ts`, `src/lib/cors.ts`,
    `src/lib/validation.ts`
  - NEW `dashbord-realstat/prisma/.gitignore` content (same ignore rules)
- **Commands:**
  - `cd dashbord-realstat && npm install @prisma/client@5.22.0 && npm install -D prisma@5.22.0`
  - add `"postinstall": "prisma generate"` to dashboard `package.json`
  - `npx prisma generate` (uses `prisma/schema.prisma`; requires the 6 server-only env
    vars present — see ENVIRONMENT_PLAN.md Phase 1)
  - `npx prisma migrate status` → must report **database is up to date** (migrations copied,
    history preserved, schema untouched)
- **Risks:** Prisma version drift; migration-history mismatch. **Mitigation:** pin 5.22.0
  matching public; verify `migrate status` shows 4 applied migrations.
- **Rollback point:** `git checkout` the dashboard repo (drop `prisma/`, `src/lib/*`).
- **Validation tests:** `npm run typecheck` (dashboard) passes with Prisma types;
  `npx prisma migrate status` clean; a scratch server-only script can `prisma.post.findMany()`.
- **Commit boundary:** dashboard commit "feat: backend foundation (prisma + libs)". No API
  routes yet. Public repo untouched.

---

## Phase 2 — Read-only reference routes (`GET categories/types/posts/details`)

**Goal:** the 4 read surfaces work from `:3001` and return identical shapes.

- **Exact files (move logic, per TARGET_ARCHITECTURE.md §2):**
  - `realestat/src/app/api/categories/route.tsx` → `dashbord-realstat/src/app/api/categories/route.ts` (GET part only)
  - `realestat/src/app/api/types/route.tsx` → `dashbord-realstat/src/app/api/types/route.ts` (GET part only)
  - `realestat/src/app/api/posts/route.tsx` → `dashbord-realstat/src/app/api/posts/route.ts` (GET part only)
  - `realestat/src/app/api/details/route.tsx` → `dashbord-realstat/src/app/api/details/route.ts` (GET part only)
  - All use `@/lib/prisma`; no Cloudinary/auth yet.
- **Commands:** `cd dashbord-realstat && npm run build && npm run typecheck`;
  `npx next start -p 3001`.
- **Risks:** case-sensitivity; PII leak on `GET /api/posts`. **Mitigation:** keep exact
  route casing; in the destination GET, **omit `DateReserve` rows** (fix the leak while
  copying — verify the dashboard's posts table doesn't depend on embedded reservations;
  it renders `row.DateReserve` so confirm the property is still present as empty array).
- **Rollback point:** dashboard commit revert (old routes untouched in public).
- **Validation tests:**
  - `GET :3001/api/posts` → same 9 posts, same field set as `:3000`.
  - `GET :3001/api/details` → same 6 details.
  - `GET :3001/api/categories` / `api/types` → same lists.
  - Compare response JSON diff between `:3000` and `:3001` for each endpoint.
- **Commit boundary:** dashboard commit "feat: read-only reference routes". Public repo
  untouched.

---

## Phase 3 — Listing mutation routes + Cloudinary

**Goal:** the dashboard can fully CRUD listings against its own backend.

- **Exact files (move to dashboard):**
  - `posts/route.tsx` POST part, `posts/[id]/route.tsx` (GET/PUT/DELETE),
    `postsDetails/[id]/route.tsx` (PUT), `details/route.tsx` POST,
    `details/[id]/route.tsx` (GET/PUT)
  - Cloudinary → `@/lib/cloudinary`; keep folder `realstat`; keep image diff-and-destroy
    semantics exactly (no re-upload of existing URLs, destroy only unreferenced).
- **Commands:** `npm run build`; start `:3001`; run the CRUD regression (below).
- **Risks:** **Cloudinary delete is destructive**; `postsDetails` casing; PUT `status`
  requirement. **Mitigation:** test with a temp listing; destroy is called only for
  unreferenced images; verify Cloudinary inventory before/after.
- **Rollback point:** dashboard commit revert; public API still serves writes (nothing
  consumer-facing changed yet).
- **Validation tests (temp data, cleaned up):**
  - POST post → 201, image in Cloudinary; GET list reflects it.
  - PUT post (add image, keep existing) → existing URL preserved, no re-upload churn.
  - PUT `postsDetails/[id]` → combined post+detail update works (exact case).
  - POST/PUT detail; DELETE post → row + detail gone + Cloudinary asset destroyed.
- **Commit boundary:** dashboard commit "feat: listing mutation routes + cloudinary".
  Consumers NOT yet switched (dashboard still points at `:3000`).

---

## Phase 4 — Reservations

**Goal:** `DateReserve` CRUD + post-status behavior on `:3001`.

- **Exact files:** `DateReserve/route.tsx`, `DateReserve/[id]/route.tsx` → dashboard;
  preserve `reservedDates` expansion and the `Post.status` auto-flip side-effect.
  Guard `price` NaN (`Number.isFinite`) and restore the date-range validation
  (`dateDebut < dateFine`) that is currently commented out.
- **Commands:** `npm run build`; start `:3001`.
- **Risks:** status side-effects mutate listings. **Mitigation:** test on a temp
  reservation linked to a Location post; verify `taken`/`available` flips match the
  public behavior; restore post status after the test.
- **Rollback point:** dashboard commit revert.
- **Validation tests (temp reservation, cleaned up):** POST → appears in list with
  `reservedDates`; PUT → persists; DELETE → empty list; post status flips identically on
  `:3000` and `:3001`.
- **Commit boundary:** dashboard commit "feat: reservations routes".

---

## Phase 5 — Authentication, JWT, route protection, CORS

**Goal:** login and mutations live in the dashboard backend; the dashboard's middleware
guards its own `/api/*` mutations; CORS serves both apps.

- **Exact files:**
  - `realestat/src/app/api/login/route.jsx` → `dashbord-realstat/src/app/api/login/route.ts`
    using `@/lib/auth`; **remove the hardcoded `JWT_SECRET` fallback** (env only).
  - `realestat/src/middleware.ts` CORS layer merged into `dashbord-realstat/src/middleware.ts`
    alongside the existing `/dashboard` cookie guard; add `Vary: Origin`.
  - `@/lib/cors.ts` allow-list: `http://localhost:3000`, `http://localhost:3001` (+ prod
    domains in Phase 8).
  - Optional (recommended): verify token on `/api/*` mutation methods; do not block public
    GETs.
- **Commands:** `npm run build`; start both apps.
- **Risks:** cookie scope — the `token` cookie is set by the dashboard client; when login
  becomes same-origin (`:3001`), cookie set with `secure:true, sameSite:strict` continues
  to work on `localhost` (secure context) — verify; **do not** add `HttpOnly` yet (client
  reads it). CORS during dual-running: both origins in allow-list.
- **Rollback point:** dashboard commit revert; public login route still present until
  Phase 6 verification.
- **Validation tests:** `POST :3001/api/login` good/bad creds → 200/401; dashboard login
  flow via `:3001`; protected dashboard pages still redirect without token; CORS header
  present from `:3000` and `:3001` origins; mutations rejected cross-origin from
  unlisted origins.
- **Commit boundary:** dashboard commit "feat: auth + CORS". Public `login` route kept
  temporarily.

---

## Phase 6 — Consumer cutover (dashboard → own origin; public → new origin)

**Goal:** both apps talk to the dashboard/backend origin; old public routes now unused.

- **Exact files (env values only — no consumer source edits):**
  - `dashbord-realstat/.env`: `NEXT_PUBLIC_API_URL=http://localhost:3001`
  - `realestat/.env`: `NEXT_PUBLIC_API_URL=http://localhost:3001`
  - Rebuild/restart both apps.
- **Commands:** restart both `next start` servers; run full regression.
- **Risks:** a consumer still hitting `:3000` breaks silently. **Mitigation:** grep both
  `src/` trees for hardcoded `:3000` and for any non-`API_BASE_URL` fetch.
- **Rollback point:** revert the two `.env` values (one command each); product returns to
  the pre-cutover state with zero code changes.
- **Validation tests (full regression):**
  - Dashboard: login, posts list, create/update/delete listing + detail, orders
    create/view/update/delete, image upload/update/delete.
  - Public: `/`, `/Index`, `/properties`, `/gallery`, `/service`, `/contact` all 200 with
    listings rendered from `:3001`; contact form still posts to external API; WhatsApp
    share links use `SITE_BASE_URL`.
- **Commit boundary:** dashboard commit "chore: point API at own origin"; public commit
  "chore: point public API at dashboard backend". At this point **no live consumer uses
  the public `/api/**` routes**.

---

## Phase 7 — Remove backend from the public app

**Goal:** `realestat` is frontend-only.

- **Exact files to delete from `realestat`:**
  - `src/app/api/**` (all 15 route files) — after zero-consumer confirmation (Phase 6).
  - `prisma/` (schema + migrations + lock file).
  - `src/middleware.ts` (CORS no longer needed in public app).
  - `src/server.js` (dead Express), `next.config.mjs` (dead), `src/app/utils/cloudinary.js`,
    `src/app/utils/upload.js`.
  - `.github/workflows/ci.yml` (**suspected secret-exfiltration payload — remove/disable**).
  - Backend-only deps from `package.json`: `@prisma/client`, `prisma` (dev), `bcryptjs`,
    `bcrypt`, `jsonwebtoken`, `cloudinary`, `express`, `cors`, `dotenv`, `multer`,
    `formidable`, `@formspree/react`, `emailjs-com`, and their `@types/*`.
  - Backend env vars from `.env` and `env.example` (see ENVIRONMENT_PLAN.md §3 Phase 7).
  - `"postinstall": "prisma generate"` script.
- **Commands:** `npm uninstall <list>`; delete files; `npm run build` (PASS = frontend-only).
- **Risks:** accidentally removing something the public frontend imports.
  **Mitigation:** build + run the app; grep for `prisma|cloudinary|bcrypt|jwt|@/lib` in
  `src/pages`, `src/components`, `src/config`.
- **Rollback point:** git checkout restores all removed backend files (nothing else
  depends on their removal except the deleted `.env` values, which are recoverable from
  the Phase 0 backup of `.env` — documented, never committed).
- **Validation tests:** public `npm run build` PASS; all public pages 200 against `:3001`;
  `npm run lint` reports no NEW errors; `grep -r "api/posts"` only shows the config-driven
  `API_BASE_URL` usages.
- **Commit boundary:** public commit "refactor: remove backend, public app is frontend-only".

---

## Phase 8 — Deployment and production cutover

**Goal:** production runs on the new topology.

- **Exact files:** dashboard/backend deployment env + public deployment env; CORS
  allow-list in `dashbord-realstat/src/lib/cors.ts` updated to prod origins.
- **Commands (per provider):**
  - Dashboard/backend host: deploy with the 6 server-only vars + `NEXT_PUBLIC_API_URL` =
    dashboard origin; ensure `prisma generate`/`migrate deploy` runs in build (only if a
    future schema change exists — **no migration in this project**).
  - Public host: deploy with `NEXT_PUBLIC_API_URL` = dashboard/backend origin,
    `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_API_URL`.
  - Update CORS allow-list to `https://<dashboard-host>` and `https://<public-host>`;
    remove `localhost` entries only after local smoke tests pass.
- **Risks:** serverless DB connection limits (Prisma singleton mitigates); CORS
  misconfiguration; stale env. **Mitigation:** smoke tests below + rollback plan.
- **Rollback point:** point `NEXT_PUBLIC_API_URL` back at a re-deployed old public API
  (Phase 0 snapshot) or revert the dashboard backend deployment.
- **Validation tests (smoke):** both apps load; listings render; dashboard CRUD incl.
  image upload/delete; login; orders; contact form; CORS from both origins; DB connection
  stable under load.
- **Commit boundary:** production config/deployment records; no source change required.

---

## Phase dependency graph

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
   │          │
   └── prerequisites for everything     └── 2–4 can be merged per checkpoint, but stay
                                            sequential; 5 depends on 1–4; 6 depends on 5;
                                            7 depends on 6; 8 last.
```

## Commit boundaries per repo

| Phase | Public (`realestat`) | Dashboard (`dashbord-realstat`) |
|---|---|---|
| 0 | baseline note commit | baseline note commit |
| 1 | (none) | backend foundation |
| 2 | (none) | read-only reference routes |
| 3 | (none) | listing mutation routes + cloudinary |
| 4 | (none) | reservations routes |
| 5 | (none) | auth + CORS |
| 6 | chore: point public API at dashboard backend | chore: point API at own origin |
| 7 | refactor: remove backend | (none) |
| 8 | deployment/env records | deployment/env records |
