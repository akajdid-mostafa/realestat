# Phase 2 Read Routes — Read-Only Reference Routes on :3001

Date: 2026-08-02
Scope: first API routes live in `dashbord-realstat` (:3001). GET only. No
consumer cutover, no mutation methods, no schema/data/migration change, no push.

## 1. Initial commit hashes and git state

| Repo | Branch | HEAD (before) | State |
| --- | --- | --- | --- |
| `realestat` | `master` | `03f1f78d625faec651cbab047c6a635f8600cf84` ("docs: record backend migration phase 1") | clean |
| `dashbord-realstat` | `main` | `d2135cb4806bc277ec6c03795e360131c8e9b94d` ("feat: add backend foundation with Prisma and shared libs") | clean |

Both clean before editing. Dashboard `.env` has all 6 server-only variables;
`NEXT_PUBLIC_API_URL` remains `http://localhost:3000` (value not printed).

## 2. Routes created (dashboard)

| Route | File | Methods |
| --- | --- | --- |
| `GET /api/categories` | `src/app/api/categories/route.ts` | GET (POST → 405) |
| `GET /api/types` | `src/app/api/types/route.ts` | GET (POST → 405) |
| `GET /api/posts` | `src/app/api/posts/route.ts` | GET (POST → 405) |
| `GET /api/details` | `src/app/api/details/route.ts` | GET (POST → 405) |

All use the shared `@/lib/prisma` singleton. No route-level CORS helpers, no
per-route `OPTIONS`, no separate `PrismaClient`, no POST handlers. Unsupported
methods return 405 naturally (verified: `POST /api/categories` → 405).

## 3. Source → destination mapping

| Public source (`realestat`) | Dashboard destination | Notes |
| --- | --- | --- |
| `src/app/api/categories/route.tsx` (GET) | `src/app/api/categories/route.ts` | shared prisma; no POST/CORS/OPTIONS |
| `src/app/api/types/route.tsx` (GET) | `src/app/api/types/route.ts` | same |
| `src/app/api/posts/route.tsx` (GET) | `src/app/api/posts/route.ts` | PII fix + read-only status (below) |
| `src/app/api/details/route.tsx` (GET) | `src/app/api/details/route.ts` | shared prisma; GET only |

Removed from the moved logic: `console.log("dw")`, `dotenv.config()`, no-op
`setCorsHeaders`, per-route `OPTIONS`, and the module-level `new PrismaClient()`.

## 4. Response-shape decisions

### `/api/categories` and `/api/types`
- List (no query param): returns plain arrays (`[{ id, name }]` / `[{ id, type }]`).
  The old route embedded full `posts` per category/type. **Decision:** the `posts`
  field is intentionally omitted. Dashboard consumers (`contexts/post.jsx`,
  insert/update/All forms) use only `id`/`name` (`id`/`type`); no dashboard or
  public consumer reads `category.posts` / `type.posts` (verified by grep).
  Dropping the heavy embedded posts avoids shipping image payloads and unrelated
  listing data through reference endpoints.
- `?name=` (documented legacy behavior): still returns the matching
  category/type's `posts` (scalars only; no nested reservations), 404 if absent.
- Intentional difference vs :3000: the `posts` key is absent on list responses.

### `/api/posts`
- List shape, `?id=` single post, and all active filters preserved exactly:
  `?id`, `?status`, `?categoryId`, `?type`, `?ville`, `?search` (ville/adress
  insensitive OR), `?bathrooms`, `?rooms` (threshold `≤4` exact, `≥5` = `gte:5`);
  relations `category`, `type`, `Detail`, `DateReserve`; `createdAt` desc ordering.
- **DateReserve shape (PII-safe):** reservations returned as a minimal
  `[{ "id": number }]` array. The dashboard posts table renders only
  `reserve.id` (posts/page.jsx:290); no consumer uses any other reservation
  field from the posts list. `fullName`, `CIN`, `price`, dates are never
  exposed to anonymous GET.
- **Status derivation is now read-only.** The legacy GET wrote
  `post.update(...)` (N+1) flipping Location-post statuses from reservation
  dates. The new route computes the same derived status in memory
  (`earliest dateFine < now → available`; `dateDebut ≤ now ≤ dateFine → taken`,
  Location category only) and returns it without any database write. With
  `DateReserve` currently empty this is behaviorally identical; document for
  Phase 4 (reservation routes) when reservations exist.
- Error shape preserved: 500 `{ error: "Error retrieving posts", details }`; 404
  `{ error: "Post not found" }`.

### `/api/details`
- GET returns array of details each including `post` (`include: { post: true }`),
  matching the old route and public-frontend merge usage. No query params in
  either version.

## 5. PII removal result

Verified on anonymous `GET :3001/api/posts` and `?id=`:
- no `CIN`
- no reservation `fullName`
- no reservation `price`
- no `password` / user hashes
- `DateReserve` = minimal `{ id }` objects (empty array today)
- no server-only env value appears in any response
- no secret variable names in the dashboard `.next` client bundles

The old `:3000` route was NOT modified (still returns the legacy shape; PII fix
applies to the new backend only, as this phase requires).

## 6. Parity test results (both servers, :3000 vs :3001)

Derived test params from live data: `id=10`, `ville=casablaca`,
`categoryId=1`, `typeId=2`, `search=casablaca`.

| Route | Status :3000/:3001 | Counts | Order | Fields |
| --- | --- | --- | --- | --- |
| `/api/categories` | 200/200 | 2/2 | same | old-only: `posts` (intentional) |
| `/api/types` | 200/200 | 6/6 | same | old-only: `posts` (intentional) |
| `/api/posts` | 200/200 | 9/9 | same | identical |
| `/api/posts?id=10` | 200/200 | object | n/a | identical keys (incl. empty `DateReserve`) |
| `/api/posts?search=casablaca` | 200/200 | 1/1 | same | identical |
| `/api/posts?ville=casablaca` | 200/200 | 1/1 | same | identical |
| `/api/posts?categoryId=1` | 200/200 | 8/8 | same | identical |
| `/api/posts?typeId=2` | 200/200 | 9/9 | same | identical |
| `/api/details` | 200/200 | 6/6 | same | identical |

All 4 new routes return 200 in production mode on :3001. The only intentional
differences are the omitted `posts` key on category/type lists and the reduced
`DateReserve` shape (both privacy/lean-response choices documented above).

## 7. Database before/after (read-only)

| Model | Before | After | Change |
| --- | --- | --- | --- |
| Post | 9 | 9 | none |
| Detail | 6 | 6 | none |
| Category | 2 | 2 | none |
| Type | 6 | 6 | none |
| DateReserve | 0 | 0 | none |
| User | 1 | 1 | none |

Post statuses before and after: `available: 9`, `taken: 0`, `unavailable: 0` —
identical. No create/update/delete query executed; no temporary data created;
no schema/migration change.

## 8. Dashboard typecheck / build / lint

- `npm run typecheck`: PASS.
- `npm run build`: PASS (4 routes listed; `/api/posts` dynamic via `request.url`,
  others static-safe).
- `npm run lint`: 18 errors / 6 warnings — identical pre-existing baseline, **no
  issues in the new `src/app/api/*` files**.

## 9. Public build

- `realestat` `npm run build`: PASS; `git status` clean (no tracked source
  change; old `:3000` routes intact).

## 10. Confirmation — consumers remain on :3000

- Dashboard `.env` / `env.example`: `NEXT_PUBLIC_API_URL=http://localhost:3000`.
- No consumer source file changed (`contexts/post.jsx`, pages, components
  untouched).
- No mutation method moved; `POST/PUT/DELETE` handlers intentionally absent.

## 11. Rollback steps

- Dashboard: revert this commit, or `git rm -r src/app/api` — old public routes
  still serve everything; consumers are untouched.
- Public: revert the docs commit.
- Database: no writes occurred; Phase 0 backup + Neon PITR unchanged.

## 12. Final verdict

**READY FOR PHASE 3** — all four GET routes work on :3001; dashboard
typecheck/build pass; public build passes; response shapes compatible
(intentional omissions documented); filters verified; reservation PII absent;
no consumer origin changed; old :3000 routes intact; no schema/migration/data
mutation; both trees clean after commits; no secrets committed; no push.
