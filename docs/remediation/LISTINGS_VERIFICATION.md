# Sprint 2 - Listings Verification (Workflow 1-19)

Date: 2026-08-01
Status: COMPLETE (all 19 workflows verified; 4 bugs fixed)

Scope: existing Listings feature end-to-end (public app + dashboard). No new features,
no schema changes, no migrations, no seeds, no commits pushed.

## Environment under test

- Public app (owns API/Prisma/Postgres): `http://localhost:3000`
- Dashboard (consumes public API): `http://localhost:3001`
- Dashboard `.env`: `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Baseline data: 9 posts (1 Vente, 8 Location); categories: 1=Location, 2=Vente; 6 types;
  details for posts 1,2,6,7,8,10 only.

## Changes made this sprint

| File | Change |
|---|---|
| `src/components/properties/PropertyList.jsx` | Reversed `categoryId` tab mapping (`Pour Location` -> `categoryId=1`, `Pour Vente` -> `categoryId=2`); city filter now sends `ville` instead of `search` (fixes collision with the text search param); added fetch error state (Chakra `Alert`) instead of misleading empty state. |
| `src/app/api/posts/[id]/route.tsx` | PUT no longer overwrites `title` with `typeId,categoryId`; DELETE (and PUT image replacement) now resolves the full Cloudinary public_id including the `realstat/` folder so images are actually destroyed. |
| `src/app/api/postsdetails/[id]` -> `src/app/api/postsDetails/[id]` | Renamed to exact case the dashboard calls (`/api/postsDetails/{id}`); Next.js route matching is case-sensitive, so the old spelling 404'd from the dashboard (which silently fell back to two calls). |
| `src/app/api/postsDtails/[id]` (deleted) | Removed duplicate combined-update route that nothing referenced. |

Note for committing the rename on macOS (case-insensitive FS): the `postsdetails -> postsDetails`
rename is already staged via `git mv` so a later `git add -A`/commit keeps the correct case for
Vercel/Linux.

## Workflow verification results

Legend: WORKING = verified end-to-end. BROKEN = was broken, now fixed + verified.

Public (read) workflows:

| # | Workflow | Result |
|---|---|---|
| 1 | Public root redirects `/` -> `/Index` (next.config.js) | WORKING (308) |
| 2 | Home loads list of listings via `/api/posts` | WORKING (9 posts) |
| 3 | Text search (`search`) | WORKING |
| 4 | Category tabs Location/Vente filter correctly | BROKEN -> FIXED (was reversed) |
| 5 | Property type filter | WORKING |
| 6 | City filter | BROKEN -> FIXED (was `search` param, collided with text search; now `ville`) |
| 7 | Rooms filter | WORKING |
| 8 | Bathrooms filter | WORKING |
| 9 | Listing details modal + WhatsApp share uses env-driven `SITE_BASE_URL` | WORKING (`PropertySumary`, `PopularPropertyCard`, `popular-post`) |
| 10 | Listing image rendering (Cloudinary) | WORKING |
| 11 | Detail modal fetch + display | WORKING |
| 12 | Empty / error state | BROKEN -> FIXED (error now shows `Alert`; empty still shows NotFound) |
| 13 | Map view | WORKING |

Dashboard (CRUD) workflows (executed against the local API through the same endpoints the
dashboard calls):

| # | Workflow | Result |
|---|---|---|
| 14 | Create listing (image, category, type) | WORKING (201; image uploaded to Cloudinary) |
| 15 | Listing visible in public list + filters after create | WORKING (count 9->10; visible via category/ville/search/type) |
| 16 | Add detail (rooms/bathrooms/surface) | WORKING (title auto-regenerated with surface) |
| 17 | Update listing + detail | WORKING via `/api/postsDetails/{id}` after rename; title preserved (PUT title bug fixed) |
| 18 | Delete listing + detail | WORKING (DB row + detail removed) |
| 19 | Delete also removes Cloudinary image | BROKEN -> FIXED (was orphaning images; verified URL 404 + no orphan after delete) |

Not applicable / out of scope:
- `SearchPost.jsx` (dashboard) is defined but never imported anywhere; dashboard search is
  done in `posts/page.jsx` directly. Not tested as a workflow.
- Floating contact WhatsApp button (`src/components/whatssap.jsx`) hardcodes `immocean.ma` in a
  generic "contact us" message. This is not the listing-share URL (workflow #9 uses env-driven
  `SITE_BASE_URL`) and was left as-is (cosmetic, out of Listings scope).

## Cleanup

Both temporary listings (#11, #12) created during verification were deleted, including their
Cloudinary images. DB returned to the baseline 9 posts. No migrations, seeds, or resets.

## Build / lint status

- Public app: `next build` passes; `next lint` has only pre-existing errors in untouched files
  (`heroservice.jsx`, `filter.jsx`, `notfound.jsx`, `service.jsx`).
- Dashboard: `next build` passes; `tsc --noEmit` clean; `next lint` has only pre-existing
  errors in untouched files (`budget.tsx`, `total-customers.jsx`, `contexts/post.jsx`).

## Known pre-existing issues (not fixed, out of Listings scope)

- Data typos in ville names (`casablaca`, `El Koudia El Beida`) - user-entered data.
- Debug `console.log` statements in several components/routes.
- `next.config.mjs` coexists with `next.config.js` (only `.js` is effective; `.mjs` has a
  conflicting permanent `/` redirect) - deployment concern, not Listings.
- Dashboard `.env` has duplicate `NEXT_PUBLIC_LOG_LEVEL` lines (harmless).
