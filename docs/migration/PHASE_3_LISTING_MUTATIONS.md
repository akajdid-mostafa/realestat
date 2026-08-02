# Phase 3 — Listing & Detail Mutation Routes

**Status:** READY FOR PHASE 4
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main) — will be committed as `feat: add listing mutation routes and cloudinary`
**Source of truth:** `realestat` (master) `src/app/api/...` routes

## Scope

Added the full listing/detail mutation API to the dashboard backend on `:3001`,
mirroring the behavior of the stabilized `realestat` routes on `:3000`. Consumers
remain on `NEXT_PUBLIC_API_URL=http://localhost:3000`; no consumer cutover.

### Routes added / extended (dashboard)

| Route | Methods | Status |
| --- | --- | --- |
| `/api/posts` | `GET` (existing), `POST` | extended |
| `/api/posts/[id]` | `GET`, `PUT`, `DELETE` | new |
| `/api/postsDetails/[id]` | `PUT` | new |
| `/api/details` | `GET` (existing), `POST` | extended |
| `/api/details/[id]` | `GET`, `PUT` | new |

Files:
- `src/app/api/posts/route.ts` (modified — added `POST`)
- `src/app/api/posts/[id]/route.ts` (new)
- `src/app/api/postsDetails/[id]/route.ts` (new)
- `src/app/api/details/route.ts` (modified — added `POST`)
- `src/app/api/details/[id]/route.ts` (new)
- `src/lib/cloudinary.ts` (modified — added `destroyImagesByUrl`)

## Behavior preserved (parity with `realestat`)

- `POST /api/posts` → `201 { id, post }`; title generated server-side
  (`<type> a <category> # <id> / surface: <n>m `), not accepted from the client.
  Image upload folder `realstat`. Detail accepted as a JSON string; invalid JSON
  → `400 Invalid Detail format`. Missing required fields → `400 { error, fields }`.
- `PUT /api/posts/[id]` → validates `status` enum (`400 Invalid status value`),
  category/type existence (`404`), post existence (`404`); image diff logic:
  base64 `data:` entries uploaded first, then only removed old Cloudinary URLs
  destroyed. Returns updated post `200`.
- `DELETE /api/posts/[id]` → destroys all Cloudinary images, deletes linked
  detail, deletes post → `200 { message: 'Post and associated detail deleted successfully' }`.
- `PUT /api/postsDetails/[id]` (exact casing, lowercase `postsdetails` NOT a
  route) → combined post + detail update; updates each block only when at least
  one field for it is truthy; detail is found by `postId`; returns
  `200 { message: 'Update successful' }`.
- `POST /api/details` → requires `postId` (`400 Post ID is required`), creates
  the detail, regenerates the post title using `surface`
  (`<type> <category> / <postId> / surface: <n>`), returns
  `201 { detail, updatedPost }`; errors → `400 { error: 'Error creating detail', details }`.
  Duplicate detail for a post is rejected (unique `postId`).
- `GET/PUT /api/details/[id]` → `400` bad id, `404` missing, `200` on success.
- Unsupported methods return `405` (verified for POST/DELETE on collection
  routes, GET on `postsDetails`, etc.).

## Intentional deviations (documented)

1. **Cloudinary failure cleanup (security/hygiene):** if the DB create/update
   fails after an upload, only the newly-uploaded assets are destroyed. The
   public routes leave such assets orphaned. Uploads always complete before any
   destroy, and no-churn updates destroy nothing.
2. **No `debug`/stack leakage:** error responses keep the `{ error, details }`
   shape but never include the public route's `debug` payload (which contained
   the full error object and env-config presence) — avoids leaking server
   internals.
3. **Invalid JSON body → `400 Invalid JSON body`** (public threw → `500`).
4. **PII-safe `DateReserve`:** `GET`/`PUT /api/posts/[id]` return `DateReserve`
   reduced to `[{ id }]`, consistent with Phase 2. Dashboard consumers
   (`show/[id]`, `update/[id]`, `All/[id]`, `posts`) do not read reservation
   fields from these endpoints (verified by grep).
5. **`PUT /api/details/[id]` only reconnects `post` when `postId` is present**
   (public always connected, causing `500` when absent).
6. **Route params via `{ params }`** instead of parsing `req.url`.
7. **No `OPTIONS` handlers** — the dashboard has no central CORS middleware
   (CORS lives only on the public server); Next auto-answers `OPTIONS` with
   `204` and no access-control headers.

## Verification

- Live lifecycle test (44/44 passed) on `:3001` (dashboard) with a temporary
  listing, run directly against the running server, plus parity comparison with
  the public `:3000` server:
  - Create (both servers) → identical generated titles (modulo id).
  - GET single post — same scalar fields; new route returns PII-safe
    `DateReserve`.
  - PUT image change → new asset uploaded, kept URL preserved; no-churn PUT
    destroys nothing.
  - Combined `postsDetails` update of post + detail fields.
  - Lowercase `postsdetails` → not a route (404/405).
  - `POST /api/details` title regen; duplicate rejected.
  - `GET/PUT /api/details/[id]`, including PUT without `postId`.
  - Failure paths: non-numeric id → 400; missing rows → 404; missing required
    fields → 400 with `fields`; invalid status → 400; bad categoryId → 400/404;
    invalid status on POST → rejected.
  - DELETE both temp posts → 200; subsequent GET → 404.
- DB before/after identical: 9 posts / 6 details / 2 categories / 6 types /
  0 DateReserve / 1 user; all 9 posts `available`. Temp records fully removed.
- Cloudinary: every asset uploaded by the tests was destroyed on cleanup. One
  orphan remains in `realstat/` — `xwiujgrepvxd755ixf7h` (736×736 jpg,
  `created_at 2026-08-01T15:14:02Z`, pre-dates Phase 3, not referenced by any
  post). Observed and left untouched; not created by this phase.
- `npm run typecheck` and `npm run build` pass on the dashboard; public
  `npm run build` passes.
- `npm run lint`: 18 errors / 6 warnings — unchanged from the Phase 2 baseline;
  none in the new/modified route files.
- No secrets in `.next` bundles (Cloudinary API secret not present).
- Read routes (`/api/posts`, `/api/categories`, `/api/types`, `/api/details`)
  still `200`; categories/types remain GET-only (`405` on mutations).

## Out of scope

- Auth on dashboard routes (deferred to Phase 5).
- Reservation (`DateReserve`) mutation routes and `login`.
- Consumer cutover to `:3001`.

## Next

Phase 4 (reservations/mutations or as defined in `MIGRATION_PHASES.md`).
