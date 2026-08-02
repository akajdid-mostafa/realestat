# Phase 7 — Public App Frontend-Only

**Status:** COMPLETE — READY FOR PHASE 8
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main)
**Public repo:** `realestat` (master)

## Scope

Removed the backend from the public app `realestat`, making it a **frontend-only**
consumer of the dashboard backend on `:3001`:

- Deleted all legacy API routes, Prisma schema/migrations, the CORS middleware,
  the dead Express `server.js`, the dead upload helpers, and the dead
  `next.config.mjs`.
- Removed all backend-only dependencies and the `postinstall` (`prisma generate`)
  script.
- Reduced `env.example` to the three frontend-only variables.
- The dashboard backend on `:3001` was **not modified** (no schema/migration/dep
  change). No DB or Cloudinary change. No push.

## Initial commit hashes / git state

| Repo | Branch | HEAD | State at start |
| --- | --- | --- | --- |
| `dashbord-realstat` | `main` | `99f7cb9 chore: cut over dashboard to own backend` | clean |
| `realestat` | `master` | `a2cd579 docs: record backend migration phase 6` | clean |

Phase 0 backup present (`pgbackup/dump/*.csv`). DB baseline unchanged:
9 posts / 6 details / 2 categories / 6 types / 0 DateReserve / 1 user, all 9
posts `available`.

## Route classification before deletion

All 15 legacy route files under `src/app/api/**` were removed from the public
app. Every **active** required route exists on the dashboard backend (`:3001`,
verified healthy):

| Route group | `:3001` | Public consumers |
| --- | --- | --- |
| `login` | POST 200 (valid) / 401 (invalid) | dashboard login |
| `posts` (+ `posts/[id]`) | GET/POST/PUT/DELETE | dashboard + public (reads) |
| `postsDetails/[id]` | PUT (GET → 405, by design) | dashboard |
| `details` (+ `details/[id]`) | GET/POST/PUT | dashboard + public (reads) |
| `categories`, `types` | GET list | dashboard dropdowns; public fetches none |
| `DateReserve` (+ `[id]`) | GET/POST/PUT/DELETE | dashboard reservations |

**Retired (no consumers, never migrated to the dashboard):** `categories/[id]`,
`types/[id]`, `partennaire`, `user`. Source scan found zero consumers in either
repo (the only reference was inside the deleted `partennaire/[id]` route itself).
No replacement routes needed.

## Files deleted

- `src/app/api/**` — 15 route files (incl. `login/route.jsx`).
- `prisma/**` — `schema.prisma` + 4 migrations + `migration_lock.toml` (dashboard
  is now the sole Prisma source of truth; byte-identical copy lives there).
- `src/middleware.ts` — legacy CORS layer (the dashboard owns CORS now; public
  app has no `/api` to guard).
- `src/server.js` — dead Express mock server (listened on `:3009`).
- `src/app/utils/cloudinary.js`, `src/app/utils/upload.js` — never imported.
- `next.config.mjs` — dead duplicate; Next resolves `next.config.js` first and
  the build proves `next.config.js` (redirects, `images.domains` Cloudinary) is
  the active one. The `.mjs` held a self-redirect `/` → `/`.
- `tsconfig.json` — removed the stale `src/app/api/login/route.jsx` include entry.

## Dependencies removed

`npm uninstall` (updates `package-lock.json`; no hand-editing):

- **dependencies:** `@prisma/client`, `@types/express`, `bcrypt`, `bcryptjs`,
  `cloudinary`, `cors`, `dotenv`, `express`, `jsonwebtoken`.
- **devDependencies:** `@types/bcryptjs`, `@types/cors`, `@types/formidable`,
  `@types/jsonwebtoken`, `@types/multer`, `@types/node-cron`, `bcrypt`,
  `bcryptjs`, `jsonwebtoken`, `prisma`.
- Script `postinstall: prisma generate` removed (no Prisma left to generate).

Kept (frontend only): `next`, `react`, `axios`, chakra/mui/radix/mdb UI kits,
leaflet/react-leaflet/google maps, fancybox, framer-motion, swiper/slick,
sass/tailwind/autoprefixer/postcss, eslint/next-config/typescript, and the
miscellaneous UI utilities.

## env.example

Reduced to the three frontend-only variables with guidance:
`NEXT_PUBLIC_API_URL` (`http://localhost:3001`), `NEXT_PUBLIC_SITE_URL`
(`http://localhost:3000`), `NEXT_PUBLIC_CONTACT_API_URL` (external). Backend
variables (DB, JWT, Cloudinary) removed from the template. Local `.env` was **not
modified** and is not included in any commit.

## Build / typecheck / lint

- Public: clean install (`rm -rf node_modules .next; npm install`) → `npm run
  build` **PASS** — 9 static pages, **zero API routes** in the output; `npm run
  lint` **25 errors / 2 warnings — identical to the pre-existing baseline**, no
  new issues.
- Dashboard: `npm run typecheck` PASS; `npm run build` PASS — middleware and all
  API routes intact, **untouched** (git status clean before and after).
- Secret scan: no `JWT_SECRET`, Cloudinary secret, or `AdminPassword123` string
  in any public `.next` bundle. No `localhost:3000/api` reference remains in the
  public build (only `:3001` API base and `:3000` as site URL).

## Runtime verification

Both apps started (public `next start` `:3000`, dashboard `next dev` `:3001`):

- Public `/api/posts`, `/api/login`, `/api/categories`, `/api/DateReserve` → all
  **404** (backend gone from the public app).
- Public pages → 200: `/` (308 → `/Index`), `/Index`, `/properties`, `/about`,
  `/contact`, `/service`, `/gallery`, `/gallery/[id]` (only dynamic detail
  route). `/properties/1` → 404 by design (no such route; detail lives at
  `/gallery/[id]`).
- Built client bundles reference `localhost:3001` (API) and `localhost:3000`
  (site URL for WhatsApp links); external contact URL
  (`email-fawn-alpha.vercel.app`) inlined.
- Dashboard backend (`:3001`): login 200 + JWT (test creds `admin@example.com` /
  `AdminPassword123!`); authenticated reads posts/details/categories/types/
  DateReserve all 200; `postsDetails/1` GET → 405 (PUT-only by design);
  `DateReserve/1` GET → 404 (empty table, baseline). Mutations without token →
  401 (POST/PUT/DELETE). Anonymous reads → 200 (public by design). CORS from
  public origin `:3000` → `Access-Control-Allow-Origin: http://localhost:3000`.
- Data: `GET /api/posts` returns 9 posts; sample title present.

## Security finding (pre-existing, not introduced here)

`.env` is **tracked in git** (committed by legacy commits `c2f62b8`, `946c4a1`,
`6247722`) and contains real values (PostgreSQL URLs, `JWT_SECRET`, Cloudinary
secret, OpenCage key) despite `.gitignore` listing `.env`. **This predates this
phase.** Recommended follow-up (separate decision): `git rm --cached .env`, keep
the file locally, and rotate the exposed secrets if the repo is ever shared.

Also noted: `api-examples/create-admin-request.json` was found emptied mid-phase
by an unexplained process; it was restored to its committed state (test-creds
example) and is not part of this change.

## Rollback

1. **Restore the source commit:** revert the "refactor: make public app frontend
   only" commit — the full legacy backend (routes, Prisma, middleware, deps,
   `env.example`) is recoverable from `git` history.
2. **Env:** the local `.env` still carries the backend variables and was never
   removed, so the old backend can be re-targeted by setting
   `NEXT_PUBLIC_API_URL` back to `:3000` and reinstalling.
3. DB/Cloudinary unchanged; Phase 0 dump backup remains. The dashboard backend
   was never modified, so no rollback is needed there.

## Next

- Phase 8: deployment — replace localhost origins with production domains in the
  dashboard CORS allow-list and the public `NEXT_PUBLIC_API_URL`, set
  `Vary: Origin` at the CDN edge, and untrack/rotate the exposed `.env` secrets.
