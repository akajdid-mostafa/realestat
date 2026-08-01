# Sprint 2 — Orders Existing Feature Decision

**Date:** 2026-08-01
**Status:** AUDIT COMPLETE → **IMPLEMENTED** (cleanup fixes applied; see section 10).
**Decision:** **KEEP** — finalized **READY**.

## 1. Intended Orders purpose

The "Orders" feature in the admin dashboard is the **property reservation/booking**
management screen. Its intent is to manage visitor reservations against the real-estate
inventory:

- A visitor reserves a property (`Post`) for a date range (`dateDebut` → `dateFine`).
- The reservation records the visitor's identity (`fullName`, `CIN`) and the agreed price.
- Creating a reservation automatically flips the property's availability
  (`Post.status` → `taken`/`available`, driven by `CategoryName` + `dateFine`).
- The dashboard Orders page lists these reservations and lets the admin view, update, and
  delete them; the overview shows latest reservations and derived counts.

It is NOT an e-commerce order/cart system. There is no `Order` model; "Orders" maps 1:1 to
the `DateReserve` model.

## 2. Current architecture

### Backend (public app `realestat`, port 3000)
Real, persisted REST API backed by Prisma/PostgreSQL:

| Route | Methods | Behavior |
|---|---|---|
| `src/app/api/DateReserve/route.tsx` | GET, POST | List all reservations (include `post`, order by `updatedAt desc`, date-range computed as `reservedDates`); create (validates `fullName`, `CIN`, `postId`, links to post, auto-updates post status) |
| `src/app/api/DateReserve/[id]/route.tsx` | GET, PUT, DELETE | Fetch single (include `post`), update fields (`fullName`, `CIN`, `price`, dates), delete |

Prisma model `DateReserve` exists and is **migrated** (`20240927085732_init`,
`20240923153248_remove_date_post`): `id`, `dateDebut`, `dateFine`, `fullName`, `CIN`,
`price`, `postId?`, `post?` relation, `createdAt`, `updatedAt`.

### Dashboard (`dashbord-realstat`, port 3001)
- **Navigation:** sidebar `config.tsx` → `{ key: 'integrations', title: 'Orders', href: '/dashboard/orders' }` — reachable.
- **Orders page** `app/dashboard/orders/page.jsx`: "Refresh" button + an **inert** `AddOrderDialog` (its `open` is never set true here) + the real list.
- **List** `components/dashboard/integrations/integrations-filters.tsx` (`CompaniesFilters`): table of reservations (id, `fullName`, dates, `CIN`, price), search by id/CIN, category filter, pagination, per-row `OrderActions`.
- **Row actions** `components/OrderActions.tsx`: View → `OrderDetails` dialog, Delete → confirm dialog → `DELETE /api/DateReserve/[id]`, Edit → `/dashboard/updateorder/[id]`.
- **View dialog** `integrations/OrderDetails.jsx`: real reservation + linked post info.
- **Update page** `app/dashboard/updateorder/[id]/page.jsx`: pre-filled form → `PUT /api/DateReserve/[id]` → refetch → redirect to `/dashboard/orders`.
- **Create entry point** `app/dashboard/posts/page.jsx`: per-listing "Add Order" icon → `OrderDialog.jsx` (POST `/api/DateReserve`); the posts table also shows reservation ids in a `DateReserve` column.
- **State** `contexts/post.jsx` (`DataContext`): `order` state; fetches `/api/DateReserve` on mount; `createOrder/updateOrder/deleteOrder/fetchOrders` hit the same real routes.
- **Overview** `app/dashboard/page.jsx` + `overview/`: `LatestOrders` (real, top 5), `Budget` (post counts), `TotalCustomers` (order count + sum of prices, mislabeled "Profits"), `TotalProfit` (order counts by category).

## 3. Workflow statuses (verified live + by code inspection)

Legend: WORKING / PARTIAL / BROKEN / MISSING / MOCKED / NOT APPLICABLE.

| # | Workflow | Status | Evidence |
|---|---|---|---|
| 1 | Orders navigation is reachable | WORKING | Sidebar item → `/dashboard/orders` → HTTP 200 with token; 307 → `/login` without token. |
| 2 | Orders list renders | WORKING | Table + search/filter/pagination render from context `order`; page 200. DB currently has **0 orders**, so table shows headers with no rows (no empty-state message on the orders page; `LatestOrders` shows "No orders available."). |
| 3 | Existing orders come from a real persistent source | WORKING | `GET /api/DateReserve` → 200, `prisma.dateReserve.findMany` from PostgreSQL; migrated model. |
| 4 | Orders survive browser refresh | WORKING | DataContext re-fetches `/api/DateReserve` on mount; two consecutive GETs returned identical data (0). DB-backed. |
| 5 | Order detail opens | WORKING | `OrderActions` View → `OrderDetails` dialog reads real context data (id, CIN, price, dates, post title/id/status). |
| 6 | Show-order page renders meaningful content | BROKEN | `app/dashboard/showorder/[id]/page.jsx` returns an empty fragment `<> </>` (renders a blank page, HTTP 200). Nothing links to it. |
| 7 | Update-order flow targets an existing API route | WORKING | `updateorder/[id]` PUTs to `/api/DateReserve/[id]` — route exists (verified GET 404 path for missing id → real route). |
| 8 | Order status changes persist | NOT APPLICABLE | There is no `status` field on orders. The "status" chip shown in `LatestOrders` is actually derived from `post.categoryId` (and mislabeled). The related `Post.status` auto-updates on create and persists. |
| 9 | Delete behavior exists and persists | WORKING | `OrderActions` → `DELETE /api/DateReserve/[id]` → real `prisma.dateReserve.delete`. Not executed (read-only audit). |
| 10 | Orders are linked to the correct property | WORKING | `DateReserve.postId` + `post` relation; detail dialog shows post title/id/status; posts page shows reservation ids per post. |
| 11 | Orders are linked to visitor/contact information | PARTIAL | `fullName` + `CIN` stored directly on the reservation; there is no visitor/contact entity or user relation. |
| 12 | Dashboard counters accurately represent Orders | PARTIAL | Counters derive from real data but labels are misleading: `Budget`/`TotalProfit`/`LatestOrders`/orders category filter/`OrderDetails` all map category **1 → "Vente"** and **2 → "Location"**, but the DB enum is `1 = Location, 2 = Vente` (swapped). `TotalCustomers` card is titled "Customers" but renders "Orders" count + profit sum. Dead template props `value="$24k"/"1.6k"/"$15k"` are passed from `dashboard/page.jsx` but ignored by the components (no fake number is actually rendered). |
| 13 | No false success is shown | WORKING | Create: `if (!response.ok) throw` → no success shown on failure (silent `console.error`, dialog stays open). Success only on `response.ok`. |
| 14 | No request targets a missing endpoint | WORKING | Every dashboard Orders call targets `/api/DateReserve` or `/api/DateReserve/[id]`; both exist. |
| 15 | No mock or temporary data is presented as real | WORKING | All rendered orders come from PostgreSQL. No hardcoded/sample orders. The only template leftovers (`OrderModal` in `app/dashboard/model.tsx` with `customer/amount/status`, the dead `value` props) are unused and never rendered. |

**Summary: WORKING 11 · PARTIAL 2 · BROKEN 1 · MISSING 0 · MOCKED 0 · NOT APPLICABLE 1**

## 4. Persistent vs in-memory data

**Fully persistent.** Reservations live in PostgreSQL via the `DateReserve` Prisma model
(migrated) and are served by real GET/POST/PUT/DELETE routes. The dashboard re-fetches on
mount, so refresh keeps the same data. **Currently the table is empty (0 orders)** — the
feature has real plumbing but no production data in this environment.

## 5. Existing / missing API routes

**Existing:** `GET/POST /api/DateReserve`, `GET/PUT/DELETE /api/DateReserve/[id]`. All code
paths that fire requests hit these routes.

**Missing (gaps, not 404s):** no `status` field on reservations; no separate visitor/contact
entity; no "link reservation to visitor account" concept.

## 6. Prisma support

`DateReserve` is a first-class, migrated model with a `post` relation and auto-increment id.
`Post` exposes `DateReserve[]` and the posts routes already include/use it for the
status auto-derivation logic. No schema work is required for the feature to function.

## 7. User / recruiter risk if left visible

- **Core is real** — an empty-but-honest table and a working CRUD flow; not fabricated data.
- **Risk 1 — empty feature:** with 0 reservations, the Orders page shows a header-only table
  (no empty-state hint on `/dashboard/orders`), and the overview's "Latest orders" says
  "No orders available." Feels unused.
- **Risk 2 — misleading labels (highest visibility):** `Budget`, `TotalProfit`,
  `LatestOrders` chips, the Orders category filter, and the detail dialog all print
  **Vente/Location swapped** (category 1 = Location shown as "Vente"). The overview card
  named "Total Customers" renders order count + profit sum. A recruiter would see
  inconsistent/contradictory numbers.
- **Risk 3 — blank page:** `/dashboard/showorder/[id]` renders nothing if visited directly
  (not linked from any nav or action).
- **Risk 4 — dead code:** inert `AddOrderDialog` on the Orders page, unused `OrderModal`,
  dead template `value` props, unused `customers-table.tsx`. Not visible, but flagged.

## 8. Final decision: **KEEP**

**Verdict: READY** — all visible defects from section 3/7 were fixed in section 10.
No hiding or deleting. No new features.

Rationale (against the decision rules):

- **KEEP conditions are met:** core list/view/update/delete behavior works against a real
  persisted API; data is in PostgreSQL; refresh returns the same data; no fake or missing
  route is used; no mock data is presented as real.
- The feature is **not** UI-only (real migrated backend) and **not** dead/duplicated/
  architecturally incompatible (would rule out REMOVE LATER).
- HIDE would remove a genuinely functional feature from the portfolio. The visible
  defects are **presentation-level bugs** (category-label swaps, card titles, empty-state
  copy, one unlinked stub) that do not falsify data — they belong in the future cleanup
  step below, not in hiding or deleting the feature.
- No new features are recommended; the cleanup items are bug fixes / dead-code removal.

## 9. Exact files affected in the future implementation step

Dashboard (`dashbord-realstat`):
- `src/app/dashboard/config.tsx` (nav label/icon if relabeled)
- `src/app/dashboard/orders/page.jsx` (empty-state + remove inert dialog wiring)
- `src/app/dashboard/OrderDialog.jsx` (create-from-posts flow; add missing-field validation)
- `src/components/dashboard/integrations/integrations-filters.tsx` (fix category labels 1/2 swap; add empty-state row)
- `src/components/dashboard/integrations/OrderDetails.jsx` (fix category chip labels; `item.post.address` → `adress`)
- `src/components/OrderActions.tsx` (error feedback)
- `src/components/dashboard/overview/latest-orders.jsx` (fix category chips; order status semantics)
- `src/app/dashboard/showorder/[id]/page.jsx` (implement or delete the stub)
- `src/app/dashboard/updateorder/[id]/page.jsx` (PUT is fine; add error feedback)
- `src/contexts/post.jsx` (order error handling)
- `src/app/dashboard/model.tsx` (delete unused `OrderModal`)
- `src/app/dashboard/page.jsx` + `overview/budget.tsx`, `overview/total-customers.jsx`, `overview/total-profit.jsx` (fix swapped labels, card titles, remove dead `value` props)
- `src/app/dashboard/posts/page.jsx` (DateReserve column / add-order entry stays)
- `src/components/dashboard/customer/customers-table.tsx` (unused template — delete or wire)

Public API (`realestat`):
- `src/app/api/DateReserve/route.tsx`, `src/app/api/DateReserve/[id]/route.tsx` (optional: add reservation `status`, visitor linkage, stricter validation, 400 field lists)
- `prisma/schema.prisma` (only if a reservation `status` or visitor relation is ever added — not required to ship)
- `src/app/api/posts/route.tsx`, `src/app/api/posts/[id]/route.tsx`, `src/app/api/postsDetails/[id]/route.tsx` (auto-status already consumes `DateReserve`; keep)

## 10. Implementation results (completed 2026-08-01)

All changes are **bug fixes / dead-code removal / honest copy** in the dashboard repo only.
No schema, migration, seed, new feature, or API route change.

| Fix | File(s) | Result |
|---|---|---|
| Category-label swap fixed (DB is `1 = Location, 2 = Vente`) | `integrations/integrations-filters.tsx` (filter menu), `integrations/OrderDetails.jsx` (chip), `overview/latest-orders.jsx` (chips) | Labels now match the DB enum everywhere |
| Overview category filters + counts corrected | `overview/budget.tsx`, `overview/total-profit.jsx` | `Location`/`Vente` counts correct; `Ordres` → `Reservations` |
| Overview card honest title/copy | `overview/total-customers.jsx` | "Customers" → "Reservations"; shows `- N total` and `Reservation value` from real data |
| Dead template props removed | `app/dashboard/page.jsx` | No more `value="$24k"/"1.6k"/"$15k"`, `diff`, unused pass-through |
| Orders page cleaned | `app/dashboard/orders/page.jsx` | Inert `AddOrderDialog`/`selectedOrder`/`handleSaveOrder` removed; real create stays on Posts page (`OrderDialog.jsx`) |
| Empty-state message on the table | `integrations/integrations-filters.tsx` | "No reservations yet." row renders when `paginatedData.length === 0` |
| Blank stub route removed | deleted `app/dashboard/showorder/` | No more blank HTTP-200 page |
| Unused template removed | deleted `app/dashboard/model.tsx` (`OrderModal`), `components/dashboard/customer/customers-table.tsx` | No dead components |
| Create/update/delete error feedback (no false success) | `OrderDialog.jsx`, `components/OrderActions.tsx`, `app/dashboard/updateorder/[id]/page.jsx` | Inline `error` messages on failure; dialog/confirm stays open on error |

**Live CRUD verification (read/verify-only, temp data, fully cleaned up after):**
- `POST /api/DateReserve` (linked to post 10, Location) → 201; record appears in
  `GET /api/DateReserve` with `post.categoryId: 1` (Location) — matching the fixed labels.
- `GET /api/DateReserve/[id]` → 200 (detail dialog data path).
- `PUT /api/DateReserve/[id]` → 200; change persisted after re-fetch (`fullName`, `price`, `dateFine`).
- `DELETE /api/DateReserve/[id]` → 200; list back to **0** reservations (empty state visible).
- Post 10 status untouched (`available`) — the temp Location reservation with `dateFine`
  keeps `available`, as designed.
- Dashboard `/dashboard/orders` and `/dashboard` → HTTP 200 with token cookie (middleware
  presence-only, unchanged); login redirect 307 without token.
- No headless browser available, so table/chip/counter **rendering** was verified by code
  review + the live API data above (both builds compile the corrected components).

**Build / lint / typecheck:**
- Dashboard: `npm run build` → PASS; `npm run typecheck` → PASS (after clean `.next`
  rebuild — stale generated types for the deleted route were the only failure); `npm run lint`
  → 18 pre-existing errors, none in lines changed by this sprint.
- Public: `npm run build` → PASS.

**Verdict: READY.** Remaining pre-existing lint noise and the auth/token caveats are
out of scope for this cleanup and documented elsewhere (Sprint 1.1 checkpoint).

## 11. Confirmation

- **Audit:** read-only, no source code modified during the audit phase.
- **Implementation:** dashboard-only cleanup (bug fixes + dead-code removal), fully
  verified above. One temporary reservation created/updated/deleted for live CRUD proof
  and **removed**; the API is back to 0 reservations; post 10 untouched.
- **No schema, migration, or seed changes. No new features.**
- **No commit, no push.** Public repo is clean except this doc
  (`docs/remediation/ORDERS_DECISION.md`); dashboard working tree holds the fixes above
  (unstaged, awaiting the user's go-ahead to commit).
- Both local servers stopped after verification.
