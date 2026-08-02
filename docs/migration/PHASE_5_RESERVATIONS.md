# Phase 5 — Reservations (DateReserve) Routes

**Status:** READY FOR PHASE 6
**Date:** 2026-08-02
**Dashboard repo:** `dashbord-realstat` (main) — will be committed as `feat: add secured reservation routes`
**Source of truth:** `realestat` (master) `src/app/api/DateReserve/route.tsx` + `src/app/api/DateReserve/[id]/route.tsx`

> **Phase numbering note.** `MIGRATION_PHASES.md` labels this work "Phase 4
> (Reservations)". Per the current execution plan the auth/security work was
> executed first and recorded as Phase 4 (auth/security); this reservation work
> is recorded here as **Phase 5 (Reservations)**. The work itself matches the
> reservations goals in `MIGRATION_PHASES.md` exactly, and builds on the
> Phase-4 auth/middleware that protects it.

## Scope

Moved the Reservations (`DateReserve`) domain into the secured dashboard backend
on `:3001`, preserving the verified public behavior and adding the approved
validation improvements. Consumers remain on `NEXT_PUBLIC_API_URL=http://localhost:3000`;
**no consumer cutover.** Old `realestat` routes remain intact.

### Routes created (dashboard)

| Route | Methods | Protection |
| --- | --- | --- |
| `/api/DateReserve` | `GET`, `POST` | GET public; POST requires valid JWT |
| `/api/DateReserve/[id]` | `GET`, `PUT`, `DELETE` | GET public; PUT/DELETE require valid JWT |

Files:
- `src/app/api/DateReserve/route.ts` (new)
- `src/app/api/DateReserve/[id]/route.ts` (new)

Uses existing `@/lib/prisma` (singleton), `@/lib/validation`
(`parseJsonBody`, `missingRequiredFields`, `parseNumericId`). No new
`PrismaClient`, no route-level CORS, no `OPTIONS` handlers.

## Payload / response contract

### `POST /api/DateReserve` (201)

Body: `{ dateDebut?, dateFine?, fullName, price, CIN, postId }` (dates sent as
ISO strings by the UI; absent dates may be omitted or `''`).

Response `201` — parity with public POST:
```
{
  id, dateDebut: 'YYYY-MM-DD' | null, dateFine: 'YYYY-MM-DD' | null,
  fullName, price: number, CIN, postId, createdAt, updatedAt
}
```
No `reservedDates` in the POST response (parity). No `post` embedded (parity).

Errors: `400 { error: 'Missing required fields', fields }`,
`400 { error: 'Invalid postId' }`, `400 { error: 'Post with the given ID does not exist' }`
(matches public message), `400 { error: 'Invalid price' }`,
`400 { error: 'Invalid date value' }`, `400 { error: 'dateDebut must be less than dateFine' }`,
`400 { error: 'Invalid JSON body' }`, `500 { error: 'Error creating DateReserve' }`.

### `GET /api/DateReserve` (200) — public

Array ordered by `updatedAt desc`; each item:
```
{ ...record, dateDebut: 'YYYY-MM-DD' | null, dateFine: 'YYYY-MM-DD' | null,
  reservedDates: ['YYYY-MM-DD', ...], post: { ... } }
```
`reservedDates` is the **inclusive** expansion `dateDebut..dateFine` (same-day
inclusive loop as public). `post` is fully included (scalars). No PII beyond the
reservation's own `fullName`/`CIN`; no `password`/`user` data (no `user`
relation exists). No database writes during GET.

### `GET /api/DateReserve/[id]` (200) — public

Raw record (ISO `dateDebut`/`dateFine`, no `reservedDates`) with `post`
included — **parity** with public single-GET. `400` invalid id, `404` missing.

### `PUT /api/DateReserve/[id]` (200)

Editable fields: `dateDebut?`, `dateFine?`, `fullName?`, `price?`, `CIN?`.
Response `200` raw updated record (parity). No post-status side effect (parity —
public PUT does not touch post status). `400` invalid id / invalid date /
non-finite price / `dateDebut >= dateFine` / invalid JSON; `404` missing
(improvement — public threw → `500`).

### `DELETE /api/DateReserve/[id]` (200)

Deletes the reservation. Response `200` raw deleted record (parity). **No post
status restore** (parity — existing behavior does not restore status on
delete; the posts GET route's derived-status logic handles Location
availability). `400` invalid id; `404` missing (improvement — public threw →
`500`).

## Post-status side effect (POST only — exact public rule)

After a successful create, exactly one post update runs:

| Post category | Reservation has `dateFine` | Resulting `post.status` |
| --- | --- | --- |
| `Location` | yes | `available` |
| `Location` | no | `taken` |
| `Vente` | any | `taken` |

- Only the linked `postId` is updated — never unrelated posts.
- `PUT` and `DELETE` never change post status (parity).
- Documented rule (public `route.tsx`): Location reservations with an end date
  keep the listing available; Location reservations without an end date, and all
  Vente reservations, mark it taken.

## Auth protection matrix (verified against `:3001`)

| Request | No token | Malformed | Forged | Expired | Valid token |
| --- | --- | --- | --- | --- | --- |
| `GET /api/DateReserve` | 200 | 200 | 200 | 200 | 200 (public) |
| `GET /api/DateReserve/[id]` | 200/404 | — | — | — | 200/404 (public) |
| `POST /api/DateReserve` | 401 | 401 | 401 | 401 | route logic (400/201) |
| `PUT /api/DateReserve/[id]` | 401 | 401 | 401 | 401 | route logic (400/404/200) |
| `DELETE /api/DateReserve/[id]` | 401 | 401 | 401 | 401 | route logic (400/404/200) |

Middleware unchanged from Phase 4: token from `Authorization: Bearer <token>`
then the `token` cookie; generic `401 { error: 'Unauthorized' }`; GET/OPTIONS
and `POST /api/login` public. Lowercase `/api/dateReserve` → 404 (exact-case
route, parity). 19/19 matrix checks passed.

## Direct CRUD verification (45/45 passed, temp data cleaned up)

Used clearly-identifiable temporary reservations (test-only names/CINs) linked
to existing Location/Vente posts; all fully deleted and post statuses restored.

1. POST → 201 (both old `:3000` and new `:3001`).
2. GET list includes the temp record.
3. GET by id → 200.
4. `reservedDates` correct (inclusive expansion).
5. Linked `post` relation correct.
6. Post-status side effects match `:3000`: Location+`dateFine` → `available`;
   Vente → `taken`; Location without `dateFine` → `taken` (all verified, then
   statuses restored).
7. PUT changes `fullName`/`price`/`dateFine` → 200.
8. Refresh/re-fetch persists the changes.
9. DELETE → 200.
10. GET by id → 404.
11. List returns to baseline (0 reservations); post statuses restored.

## Parity vs `:3000`

- **GET list:** byte-identical JSON between `:3000` and `:3001` (same DB) —
  same records, ordering, `reservedDates`, `YYYY-MM-DD` formatting, embedded
  `post`.
- **GET single:** byte-identical JSON.
- **POST/PUT/DELETE:** identical response status codes and key sets.
- **Error behavior compared:** missing fields (400 both), missing post (400
  both), invalid price (400 both), invalid date (400 both), invalid id (400
  both), invalid date range (NEW 400 vs OLD accepted), missing reservation on
  PUT/DELETE (NEW 404 vs OLD 500).

## Intentional improvements (documented deviations)

1. **Stricter date-range validation:** `dateDebut < dateFine` required. The
   public route had this check commented out and silently accepted
   `dateDebut >= dateFine` (creating a record whose `reservedDates` expanded to
   an empty array). NEW rejects with `400`.
2. **Finite-number price validation:** `Number.isFinite` on the parsed price
   (public wrote `NaN` through and failed on the Prisma `Float` constraint).
3. **Valid-date parsing:** explicit invalid-date → `400` (public leaked the
   Prisma `Invalid time value` message).
4. **Honest `404`** for missing reservation on GET/PUT/DELETE (public
   PUT/DELETE returned `500` via a Prisma `P2025` error).
5. **Numeric `postId`/`id` parsing:** `parseNumericId` (positive integers only)
   instead of bare `parseInt`.
6. **`400 Invalid JSON body`** for malformed JSON (public threw → `400` with
   leaked message).
7. **Missing fields → `{ error, fields: [...] }`** field list.
8. **No debug/stack leakage** and no `console.log` of ranges — only error
   messages are logged, never payloads.
9. **Shared Prisma singleton** (`@/lib/prisma`); no new `PrismaClient`.
10. **Route params via `{ params }`**; no route-level CORS (single middleware
    source).

## Dashboard compatibility (temporarily tested against `:3001`)

With a **temporary** `NEXT_PUBLIC_API_URL=http://localhost:3001` override
(restored to `:3000` immediately after), the existing dashboard Orders
workflows were exercised at the API-contract level with the exact UI payloads
and the same-origin `token` cookie (the browser's automatic cookie = the
middleware's cookie path, no Bearer header needed):

- Orders list loads (context `fetchOrders`) — 15/15 checks passed.
- Create from Posts page (`OrderDialog` POST payload) → 201; datepicker
  `reservedDates` exclusion array present.
- View dialog (`GET` single + embedded `post` for title/status/category) → 200.
- Update page (`updateorder` PUT payload) → 200; persisted after re-fetch.
- Delete (`OrderActions` DELETE) → 200; list back to empty state.
- Overview reads: `post.categoryId` present for `TotalProfit`; price sum works
  for `TotalCustomers`.
- Refresh persistence: consecutive GETs identical.
- Post 2 (Location) status unchanged (`available`) throughout.
- Env restored to `http://localhost:3000`; `.env` never committed.

No dashboard consumer source files were changed in this phase — the Phase-4
cookie-token path makes the existing plain-`fetch` Orders mutations work on
`:3001`.

## Database verification (before/after)

- Before: 9 posts / 6 details / 2 categories / 6 types / 0 DateReserve /
  1 user; all 9 posts `available`.
- After (post-cleanup): **exactly identical** — 0 DateReserve, all 9 posts
  `available`, 9/6/2/6/0/1.
- No schema/migration change. No orphan reservation. No unrelated post-status
  change (the three exercised posts were restored to `available`).

## Build / typecheck / lint

- Dashboard: `npm run typecheck` PASS; `npm run build` PASS (build output lists
  `/api/DateReserve` and `/api/DateReserve/[id]`, Edge Middleware 27.2 kB);
  `npm run lint` → same 18 errors / 6 warnings as the Phase 2–4 baseline, none
  in the new route files; `prettier --check` clean on the new files.
- Public: `npm run build` PASS; public tracked source **unchanged** (tree
  clean).

## Configuration & hygiene confirmation

- `NEXT_PUBLIC_API_URL` restored to `http://localhost:3000` in the dashboard
  `.env` (unchanged in public). **No consumer cutover.**
- Old `:3000` `/api/DateReserve` routes intact and functional.
- No `/api/user` or partenaire route moved. No new `PrismaClient`. No
  route-level CORS. No schema/migration change.
- `JWT_SECRET` absent from `.next` bundles; no credentials, JWT values, test
  CINs, or test names in any committed file or log.

## Rollback

- **Dashboard:** `git revert` (or `git checkout`) the phase commit —
  `src/app/api/DateReserve/` is the only change; removing it restores the
  pre-phase backend. Old public routes were never touched.
- **Public:** revert the docs commit (documentation only).
- **Consumers:** none were switched; `NEXT_PUBLIC_API_URL` remains `:3000`.
- **DB:** no schema/data change; Phase 0 dump backup remains available.

## Next

- Consumer cutover to `:3001` per `MIGRATION_PHASES.md` Phase 6, then public
  backend removal (Phase 7).
