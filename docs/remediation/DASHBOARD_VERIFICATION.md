# Sprint 2 — Dashboard Existing Features Verification

**Date:** 2026-08-01
**Scope:** Verify and stabilize the EXISTING admin dashboard workflows (no new features, no redesign, no Orders work, no migration).

## 1. Scope

Verify 21 existing dashboard workflows end-to-end against the public REST API. Fix ONLY bugs that block an existing workflow. Use temporary test data only; every temporary record and uploaded image was removed at the end.

## 2. Environment / ports

| App | Repository | Local URL | Role |
|---|---|---|---|
| Public site / API | `realestat` | `http://localhost:3000` | Next.js app + REST API, Prisma, PostgreSQL, Cloudinary |
| Admin dashboard | `dashbord-realstat` | `http://localhost:3001` | Next.js client consuming the public API cross-origin |

- Servers started in production mode (`next build` + `next start`, dashboard on `-p 3001`).
- CORS: `src/middleware.ts` (allowed origins `3000`, `3001`) verified — `Access-Control-Allow-Origin: http://localhost:3001` present on `/api/login` responses.
- DB reachable: 9 posts, 6 details, 2 categories, 6 types, 1 admin user.

## 3. Workflows tested (status per workflow)

Legend: WORKING = verified; PARTIAL = works with a documented limitation; BROKEN = blocking; NOT APPLICABLE.

| # | Workflow | Status | Notes |
|---|---|---|---|
| 1 | Login | WORKING | Bad creds → 401 identical generic error, no token, CORS present. Valid-credential flow (HTTP 200 + JWT) previously verified in Sprint 1.1; token-cookie path re-verified here. |
| 2 | Session persistence after refresh | WORKING | `/dashboard` with token cookie → 200 repeatedly; no token → 307 → `/login`. |
| 3 | Logout | WORKING | Removing the `token` cookie (js-cookie, path `/`) → next protected request 307 → `/login`. |
| 4 | Dashboard landing page loads | WORKING | `/dashboard` → 200; renders IMMOCEAN shell, Overview/Posts/Orders nav, stat cards. |
| 5 | Posts list loads | WORKING | `/dashboard/posts` renders from `GET /api/posts` (200, 9 posts). |
| 6 | Existing dashboard search works | WORKING | Inline search (id/title/address/city/category + city/category/status filters) verified against live data. |
| 7 | Create listing | WORKING | `POST /api/posts` → 201, auto-generated title, correct category/type join. |
| 8 | Upload one or more images | WORKING | Base64 → Cloudinary (`folder: realstat`); multiple images verified (2-image listing). |
| 9 | Categories dropdown loads | WORKING | `GET /api/categories` → 200 (Location, Vente); insert/update Selects consume it. |
| 10 | Types dropdown loads | WORKING | `GET /api/types` → 200 (6 types); insert/update Selects consume it. |
| 11 | Map / geocoding works | WORKING | Leaflet map renders (OSM tiles); click sets lat/lon first (create works) then reverse-geocodes; address search does forward geocoding. Geocoding reads ONLY `process.env.NEXT_PUBLIC_OPENCAGE_API_KEY` (hardcoded fallback removed). If the key is missing/401 the component does NOT crash: coordinates stay set, manual address entry remains available, and an honest error message is shown for search. The key must be configured per environment (gitignored, never committed). Live forward/reverse responses depend on that key being valid. |
| 12 | Add listing details | WORKING | `POST /api/details` → 201; detail linked by `postId`; title regenerated with surface. |
| 13 | Update listing | WORKING | `PUT /api/posts/[id]` and combined `PUT /api/postsDetails/[id]` → 200; price/address/status persist. Fixed (see §5-Bug1). |
| 14 | Update details | WORKING | `PUT /api/details/[id]` → 200; combined `postsDetails` path also updates detail. |
| 15 | Show/view listing | WORKING | `GET /api/posts/[id]` returns full post + Detail; `/dashboard/show/[id]` renders post, details, images. |
| 16 | Change ONLINE/OFFLINE status if currently supported | WORKING | Set `unavailable` via PUT → persists across list GETs and the `?status=unavailable` filter (previously reset to `available`). Fixed (see §5-Bug3). |
| 17 | Delete listing | WORKING | `DELETE /api/posts/[id]` → 200; post 404 after; related Detail cascade-deleted. |
| 18 | Deleted Cloudinary images are removed | WORKING | Cloudinary Admin inventory: test asset public_ids present before delete, removed after (verified twice). |
| 19 | Public app reflects create/update/delete changes | WORKING | Create → visible in `GET /api/posts` and `?ville=` filter; update → new price/status; delete → 404 + removed from list. Public pages `/Index`, `/properties`, `/contact`, `/gallery`, `/service` all 200. |
| 20 | Invalid API/network response shows an honest error | WORKING | Missing fields → 400 `Missing required fields [fields]`; bad category/type → 400; invalid status on PUT → 400 `Invalid status value`. Dashboard forms surface API error/network error text (no false success). |
| 21 | Refresh does not lose required dashboard state | WORKING | DataContext refetches categories/types/posts/details/orders on mount; token cookie persists; update form prefill reads refreshed context. |

## 4. Bugs found

| # | Workflow | Severity | File | Observed | Expected | Root cause |
|---|---|---|---|---|---|---|
| Bug1 | 13/8/18 | HIGH | `src/app/api/posts/[id]/route.tsx`, `src/app/api/postsDetails/[id]/route.tsx` | PUT with existing image URLs (or a failed upload) destroyed the existing Cloudinary images BEFORE uploading replacements, leaving dead image URLs; unchanged images were re-uploaded (churn); upload failure → HTTP 500 | Updating a listing must keep unchanged images and never destroy originals unless the replacement upload succeeds | Image block destroyed all old public_ids first, then uploaded every incoming URL as a new asset |
| Bug2 | 8/13 | HIGH | `src/app/dashboard/All/[id]/page.jsx`, `src/app/dashboard/update/[id]/page.jsx` | Selecting new images in the update form REPLACED the whole image array with only the new files → existing images dropped on save | Adding an image appends it to the existing set | `handleImageChange` set `img: base64Images` instead of appending |
| Bug3 | 16 | MEDIUM | `src/app/api/posts/route.tsx` (GET) | Admin-set `unavailable` status flipped back to `available` after the next `GET /api/posts` (auto-status reset) | Manual online/offline status must persist | GET handler force-set `available` on every post without a reservation |
| Bug4 | 14 | MEDIUM | `src/app/dashboard/All/[id]/page.jsx` | `livingrooms`, `kitchen`, `bathrooms` were NOT pre-filled in the update form; saving reset them to empty/0 (2 real listings had values) | Update form must pre-fill all stored detail fields | Pre-fill `useEffect` omitted those three fields |

## 5. Fixes applied (minimal, workflow-blocking only)

- **Fix1 (Bug1):** In both PUT handlers, split incoming images into "new" (base64 `data:`) and "kept" (existing URLs). Upload new images FIRST; on success, compose the final list (kept URLs + uploaded); then destroy ONLY images no longer referenced. If nothing changed → no-op (no destroy, no upload). This also removes the re-upload churn.
- **Fix2 (Bug2):** `handleImageChange` in both update forms now appends: `img: [...(prev.img || []), ...base64Images]`.
- **Fix3 (Bug3):** `GET /api/posts` auto-status now applies ONLY to `Location` posts that HAVE reservations (date-based `taken`/`available`). Posts without reservations keep their admin-set status. Reservation-driven behavior is unchanged.
- **Fix4 (Bug4):** `All/[id]` pre-fill now includes `livingrooms`, `kitchen`, `bathrooms` from `filteredData.Detail`.
- **Fix5 (geocoding cleanup):** `src/app/dashboard/insert/MapComponent.jsx` now reads geocoding credentials ONLY from `process.env.NEXT_PUBLIC_OPENCAGE_API_KEY`; the hardcoded fallback OpenCageData key string was removed from the source. When the variable is missing, both code paths degrade gracefully (map-click still sets coordinates; address search shows the existing honest "Geocoding API key is not configured" warning). The key lives only in gitignored `.env`.

## 6. Temporary data cleanup

- Temp listings created and deleted: `id=13`, `id=14`, `id=15` (markers `SPRINT2_VERIFY`, `SPRINT2_VERIFY_B`, `SPRINT2_FINAL`).
- Temp details (postId 13/14/15) cascade-deleted with their posts.
- Every test Cloudinary image removed (verified via Admin inventory: assets returned to the pre-test baseline; no orphans).
- Final DB state verified: 9 posts / 6 details (identical to baseline).
- `/tmp` verification artifacts removed.

## 7. Remaining limitations (documented, not blocking)

- **Geocoding key must be configured per environment.** The map/geocoding component reads `NEXT_PUBLIC_OPENCAGE_API_KEY` only; it is never hardcoded in source and is excluded from git via `.gitignore`. Each environment (local, preview, prod) must supply a valid key in its own `.env`; without one, the map still works and manual address/coordinate entry remains functional.
- **`posts/SearchPost.jsx` is dead code** (not imported anywhere) and uses `mode: 'no-cors'`, which would always fail if ever mounted. Not part of any reachable workflow; left untouched.
- **`update/[id]` page is orphaned** (not linked from any page; reachable only by direct URL) and requires a `datePost` field that has no DB column and is ignored by the API. The supported update path is `All/[id]`.
- **`Proprietary`** can be set only when creating the detail (`POST /api/details`); no update endpoint accepts it, and `All/[id]` does not expose it. Not data-losing (preserved on update).
- **Latent search crash:** dashboard inline search calls `item.category?.name.toLowerCase()`; would throw if a post ever had `categoryId = null` (none currently; schema allows nullable). Not blocking today; recommended defensive fix `(item.category?.name || '').toLowerCase()` in a future pass.
- Pre-existing lint errors in the dashboard (22) and public app (25) remain in untouched files; no new errors introduced.

## 8. Lint / typecheck / build results

- Public app: `npm run build` → **PASS (exit 0)** (after all fixes; includes Middleware).
- Dashboard: `npm run lint` → 22 PRE-EXISTING errors (none introduced by this sprint; the two modified files show only pre-existing unused-import/dependency warnings); `npm run typecheck` → **PASS**; `npm run build` → **PASS (exit 0)**.

## 9. Final verdict

**READY WITH DOCUMENTED LIMITATIONS**

All 21 workflows were exercised. Four workflow-blocking bugs were found and fixed with minimal changes, plus a geocoding cleanup that removes the hardcoded API key from source. 20 workflows are fully WORKING; workflow 11 (geocoding) is code-verified WORKING — it uses only `NEXT_PUBLIC_OPENCAGE_API_KEY`, never crashes when the key is missing, and falls back to manual address/coordinate entry — with live forward/reverse responses depending on a valid per-environment key. All temporary data and images were cleaned up and the DB is back to its exact baseline.

## Confirmation

- Contact: untouched this sprint (env-only config from the contact sprint intact).
- Listings: untouched; `GET /api/posts` (list/single/filter) verified.
- No Orders file changed.
- No migration, seed, database reset, commit, or push performed.
- Working tree (public): modified `src/app/api/posts/[id]/route.tsx`, `src/app/api/posts/route.tsx`, `src/app/api/postsDetails/[id]/route.tsx` (plus the pre-existing contact-sprint files). Working tree (dashboard): modified `src/app/dashboard/All/[id]/page.jsx`, `src/app/dashboard/update/[id]/page.jsx`, `src/app/dashboard/insert/MapComponent.jsx`.
