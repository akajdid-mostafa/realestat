# Phase 6 — Consumer Cutover to Dashboard Backend

**Status:** READY FOR PHASE 7
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main)
**Public repo:** `realestat` (master)

> **Phase numbering note.** `MIGRATION_PHASES.md` labels this "Phase 6 (consumer
> cutover)". Per the current execution plan, auth/security (recorded Phase 4) and
> reservations (recorded Phase 5) were executed first. This phase matches the
> cutover goals exactly.

## Scope

Switched both consumers to the dashboard backend on `:3001`:

- Dashboard `NEXT_PUBLIC_API_URL=http://localhost:3001` (own backend).
- Public app `NEXT_PUBLIC_API_URL=http://localhost:3001` (dashboard backend).
- Contact stays external (`NEXT_PUBLIC_CONTACT_API_URL`).
- Site/WhatsApp links stay on `NEXT_PUBLIC_SITE_URL` (public site origin).
- Old `realestat` backend on `:3000` left fully intact as rollback (routes,
  Prisma, middleware, deps all unchanged). **No route deletion, no schema or
  migration change.**

## Initial commit hashes / git state

| Repo | Branch | HEAD | State at start |
| --- | --- | --- | --- |
| `dashbord-realstat` | `main` | `b493cc0 feat: add secured reservation routes` | clean |
| `realestat` | `master` | `978c8c2 docs: record backend migration phase 5` | clean |

Both apps were started in production mode (`next build` + `next start`) and both
backends verified healthy before the cutover (`GET /api/posts` 200 on both;
`POST /api/login` bad-creds 401 on both). Phase 0 backup present
(`pgbackup/dump/*.csv`). DB baseline: 9 posts / 6 details / 2 categories /
6 types / 0 DateReserve / 1 user, all 9 posts `available`.

## Env cutover (`.env`, both untracked)

| Repo | Variable | Before | After |
| --- | --- | --- | --- |
| dashboard | `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | `http://localhost:3001` |
| public | `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | `http://localhost:3001` |
| public | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | unchanged (site URL) |
| public | `NEXT_PUBLIC_CONTACT_API_URL` | `https://email-fawn-alpha.vercel.app/api/realestat` | unchanged (external) |

`.env` files remain gitignored and untracked in both repos. The pre-cutover
values were backed up locally (never committed).

## Source fallback changes (fail-closed)

Both config files previously had a **silent fallback** to `http://localhost:3000`
(R15 in `RISK_AND_ROLLBACK.md`): a missing `NEXT_PUBLIC_API_URL` would silently
re-target the legacy backend after cutover. Replaced with **fail-closed**
configuration:

- `dashbord-realstat/src/lib/api.ts`: `API_BASE_URL` now reads
  `NEXT_PUBLIC_API_URL` and **throws** at module load if it is unset, with a clear
  message (no default, no legacy fallback).
- `realestat/src/config/api.js`: `API_BASE_URL` likewise **throws** if unset.
  `SITE_BASE_URL` (site URL default) and `CONTACT_API_URL` behavior are
  preserved unchanged.

Decision: fail-closed over same-origin-safe, because the dashboard is deployed
on its own origin (`:3001` locally, its own domain in Phase 8) and the public app
is cross-origin by design — a silent default origin of any kind is wrong after
cutover. Verified: building the public app with `NEXT_PUBLIC_API_URL` unset fails
with the clear message; with it set, the build passes. No other consumer source
changed.

## Dashboard regression against `:3001` — 54/54 PASS

All 20 requested verification items covered (with granular sub-checks), using
temporary data only; everything cleaned up afterwards.

1. **Login valid/invalid** — bad creds 401, valid creds 200 + token.
2. **Session refresh** — second login returns a fresh token.
3. **Logout** — logout is client-side cookie removal (same as pre-cutover); a
   mutation without the token → 401.
4. **Dashboard overview** — posts/details/categories/types/DateReserve all 200.
5. **Posts list/search/filter** — search no-match → `[]`, `categoryId=1/2`,
   `ville=Rabat` filters correct.
6. **Create temporary listing with image** — POST `/api/posts` 201, image
   uploaded to Cloudinary.
7. **Add detail** — POST `/api/details` 201, linked to post.
8. **View listing** — GET single 200 incl. Detail + DateReserve (public ids).
9. **Update listing** — PUT adds an image while preserving the existing
   Cloudinary URL (no re-upload churn), updates prix, persists on refresh.
10. **Combined postsDetails update** — PUT `/api/postsDetails/[id]` updates both
    post and detail fields.
11. **Status change** — PUT `status=taken` persisted on refresh.
12. **Create temporary reservation** — POST `/api/DateReserve` 201.
13. **View reservation** — list shows `reservedDates` (inclusive 5-day range),
    single GET 200.
14. **Update reservation** — PUT price/fullName persisted.
15. **Delete reservation** — DELETE 200, GET → 404.
16. **Delete temporary listing** — DELETE `/api/posts/[id]` 200 (destroys images
    + detail), GET → 404, list back to 9.
17. **Cloudinary temporary assets removed** — both temp assets verified destroyed
    (not found) after delete.
18. **Empty/error states honest** — invalid id 400, missing fields 400 with
    field list, malformed JSON 400, no-token mutation 401.
19. **Refresh persistence** — consecutive GETs identical.
20. **Cleanup / baseline** — 9/6/2/6/0/1 restored, all posts `available`.

## Public regression against `:3001`

Pages (all 200): `/` (→ `/Index`), `/Index`, `/properties`, `/gallery`,
`/service`, `/contact`. No page content was redesigned or changed.

Data (byte-identical `:3000` vs `:3001`): `GET /api/posts`, `?categoryId=1`,
`?categoryId=2`, `?type=Appartement`, `?ville=Rabat`, `?search=maison`,
`?rooms=3&bathrooms=2`, `?id=2`, and `GET /api/details`. Map data present for
all 9 posts (`img` arrays + `lat`/`lon`). Loading/empty/error states intact
(no-match search returns `[]`; the existing `fetchError` path is unchanged).

Known deviation (documented, zero consumer impact): `GET /api/categories` and
`GET /api/types` return bare lists on `:3001` (id/name and id/type) whereas
`:3000` embedded full `posts` arrays. **No public consumer fetches these
endpoints** (verified by source scan), and the bare shape is the PII-safe one the
dashboard itself uses. Embedded `posts` on the legacy response included full
reservations (CIN) — the dashboard backend intentionally omits them (R15).

Contact: the only contact code path is `CONTACT_API_URL` (external). `:3001` has
no contact route (a `POST /api/contact` returns 401 via the middleware guard).
The external contact API is reachable (OPTIONS 204). WhatsApp/share links use
`SITE_BASE_URL` (public site URL), confirmed in the client bundles.

## Zero-consumer proof for `:3000`

- **Runtime-issuable requests** come only from client JS (the public app has **no
  server-side data loading** — no `getServerSideProps`/`getStaticProps` in
  `src/pages`; the dashboard is App-Router client components). Compiled client
  bundles contain **zero** `localhost:3000` API URLs:
  - Dashboard `.next/static`: no `:3000` at all; `:3001` in all API-consuming
    chunks.
  - Public `.next/static`: no `:3000/api`; `:3001` present; `:3000` only as
    `SITE_BASE_URL` (site links) — correct.
- **Server bundles** checked too: dashboard `:3000` appears only in `cors.ts`
  (CORS allow-list) and `get-site-url.ts` (site URL default); public `:3000`
  only in the legacy middleware allow-list. None are consumers.
- **Page HTML** served by the public app contains no embedded `/api` or `:3000/api`
  URLs.
- Remaining `:3000` occurrences classified:
  - `dashbord-realstat/src/lib/cors.ts` — CORS allow-list (required; public
    origin must be allowed). **harmless / required.**
  - `dashbord-realstat/src/lib/get-site-url.ts` — site URL default. **harmless.**
  - `realestat/src/config/api.js` `SITE_BASE_URL` — site/WhatsApp URL default.
    **harmless.**
  - `realestat/src/middleware.ts` allow-list + old Vercel domains — legacy
    backend CORS (kept for rollback, removed in Phase 7). **rollback-only.**
  - `realestat/src/server.js` — dead Express mock server. **dead code.**
  - `realestat/api-examples/*.json` — API example docs referencing old origin.
    **harmless documentation.**
  - **No active blocker.**

The old backend remains fully functional on `:3000` (its routes 200) strictly as
rollback.

## CORS / auth after cutover

- Public origin `:3000` → backend `:3001`:
  - GET `http://localhost:3001/api/posts` with `Origin: http://localhost:3000` →
    200 with `Access-Control-Allow-Origin: http://localhost:3000`.
  - Preflight OPTIONS → 204 with ACAO + allow-methods + allow-headers.
  - Mutation without JWT → 401 (with ACAO so the browser can read the error).
  - Unknown origin (`http://evil.example`) → 200 but **no** ACAO header
    (browser blocks the read). No duplicate ACAO header (count = 1).
- Dashboard origin `:3001` → own backend: login 200; same-origin calls 200 with
  ACAO `http://localhost:3001`; JWT mutation protection verified (401 without
  token, route logic with token); page guard verified (`/dashboard` → 307
  `/login` without cookie, 200 with cookie).
- **Observation for Phase 8:** Next.js overrides the middleware-set
  `Vary: Origin` with its own RSC vary header on API responses. Browsers are
  unaffected; a shared CDN cache should be configured with `Vary: Origin` at the
  edge (documented, not a Phase 6 blocker, and there were **no duplicate** CORS
  headers).

## DB / Cloudinary before-after

| Item | Before | After |
| --- | --- | --- |
| posts | 9 | 9 (all `available`) |
| details | 6 | 6 |
| categories / types | 2 / 6 | 2 / 6 |
| DateReserve | 0 | 0 |
| users | 1 | 1 |
| orphan details/reserves (postId > 10) | 0 | 0 |
| Cloudinary temp assets | — | 0 (both destroyed on delete) |

The pre-existing Cloudinary orphan documented in Phase 3 was not touched.

## Build / typecheck / lint

- Dashboard: `npm run typecheck` PASS; `npm run build` PASS (with `:3001`);
  `npm run lint` 18 errors / 6 warnings — **identical to the pre-existing
  baseline**, zero issues in the changed file.
- Public: `npm run build` PASS (with `:3001`); `npm run lint` 25 errors /
  2 warnings — **identical to baseline** (verified by re-running lint with the
  change stashed), zero issues in the changed file.
- Fail-closed verified: public build with `NEXT_PUBLIC_API_URL` unset fails with
  the clear message; restored build passes.
- No secret appears in any bundle (JWT secret and Cloudinary API secret grepped
  absent from `.next` in both repos).
- Old `realestat` API routes intact (all route groups present). No schema or
  migration change (`git diff` on `prisma/` empty in both repos).

## Rollback

1. **Env (one line each, no code change):** set both `.env` back to
   `NEXT_PUBLIC_API_URL=http://localhost:3000` and restart both apps. The old
   backend was never removed, so the product returns to the pre-cutover state.
2. **Code (if needed):** revert the two source commits (`src/lib/api.ts`,
   `src/config/api.js`) — the old silent-fallback behavior is recoverable from
   `git` history, though it is intentionally replaced by fail-closed.
3. DB/Cloudinary were unchanged by this phase; the Phase 0 dump backup remains.

## Next

- Phase 7: remove the backend from the public app (routes, Prisma, deps, legacy
  middleware, dead code) after this phase's zero-consumer proof.
