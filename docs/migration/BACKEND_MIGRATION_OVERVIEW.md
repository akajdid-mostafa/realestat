# Backend Migration — Overview

**Status:** READ-ONLY PLAN (audit only). No source, package, schema, migration, commit, or push was modified.
**Date:** 2026-08-02

## 1. Purpose

Move the backend (REST API + Prisma + PostgreSQL access + authentication + Cloudinary
mutations) from the public app into the admin dashboard, so that:

- `dashbord-realstat` owns: dashboard UI, REST API, Prisma, PostgreSQL, authentication, Cloudinary.
- `realestat` becomes: public frontend only, a read-only consumer of the dashboard/backend API, and the external contact API consumer.

## 2. Current vs target topology

| Concern | Today | Target |
|---|---|---|
| Public frontend | `realestat` (:3000) | `realestat` (:3000) |
| Admin dashboard | `dashbord-realstat` (:3001) | `dashbord-realstat` (:3001) |
| REST API | `realestat` `/api/**` | `dashbord-realstat` `/api/**` |
| Prisma / PostgreSQL | `realestat` `prisma/` | `dashbord-realstat` `prisma/` |
| Authentication (`/api/login`, JWT) | `realestat` | `dashbord-realstat` |
| Cloudinary mutations | `realestat` API routes | `dashbord-realstat` API routes |
| CORS middleware | `realestat` `src/middleware.ts` | `dashbord-realstat` `src/middleware.ts` |
| Public app data reads | same-origin `/api/*` | cross-origin dashboard/backend API |
| Public contact forms | external API (unchanged) | external API (unchanged) |

## 3. Guiding constraints (from the task)

1. The existing local product keeps working at every step (dual-running supported).
2. API routes move **one domain at a time**; never a big-bang rewrite.
3. The dashboard is switched to the new local API gradually (per route group).
4. The public app is switched only after each route group is verified on the new origin.
5. Old API routes are removed only after no active consumer uses them.
6. Database schema and data remain unchanged during the move (same PostgreSQL database,
   same schema, same migration history).
7. No feature regression is introduced.

## 4. Inventory summary (full detail in ROUTE_INVENTORY.md)

- **15 active route files** (13 route groups) to move to the dashboard backend:
  categories, categories/[id], types, types/[id], posts, posts/[id], postsDetails/[id],
  details, details/[id], DateReserve, DateReserve/[id], partennaire, partennaire/[id],
  user, login.
- **4 dead backend items to delete** (no consumer, no build dependency):
  `src/server.js` (dead Express, 3 mock endpoints), `next.config.mjs` (dead, conflicting),
  `src/app/utils/cloudinary.js`, `src/app/utils/upload.js`.
- **Dead code inside routes** to clean during the move: per-route `OPTIONS` handlers
  (short-circuited by middleware), no-op `setCorsHeaders()` helpers, 15 separate
  `new PrismaClient()` instances → single shared client.
- **Public app consumers** (read-only): `popular-post.jsx`, `PopularPropertyCard.jsx`,
  `PropertyList.jsx`, `PropertyDetailModal.jsx` → `GET /api/posts` and `GET /api/details`;
  contact forms → external `CONTACT_API_URL`.
- **Dashboard consumers**: `src/contexts/post.jsx` (11 calls), `login/page.tsx`,
  `All/[id]`, `update/[id]`, `insert/page.jsx`, `OrderDialog.jsx`, `OrderActions.tsx`,
  `updateorder/[id]`, `detail/[id]`, `show/[id]` (+ dead `SearchPost.jsx`, `show/Update.jsx`).

## 5. Version / stack facts that shape the plan

| Item | Public (`realestat`) | Dashboard (`dashbord-realstat`) |
|---|---|---|
| Next.js | 14.2.x (declared 14.2.5, installed 14.2.12) | 14.2.4 |
| Router | Pages Router frontend; App Router only for `/api/**` | App Router throughout |
| React | 18 | 18.3.1 |
| Prisma | 5.22.0 (`@prisma/client`, `prisma`) | absent |
| HTTP client (app code) | `fetch` (no axios in `src/`) | `axios` + native `fetch` |
| `@/*` alias | `src/*` | `src/*` |
| `src/app/api/` | exists (15 files) | does not exist yet |
| `prisma/` | exists (4 migrations) | does not exist yet |
| middleware | CORS only (`/api/:path*`) | auth cookie presence only (`/dashboard*`) |

Both are Next 14 App Router compatible. Prisma 5.22.0 works on both. There is **no
version conflict** that blocks the move; the difference to manage is Next 14.2.4 vs
14.2.12 (dashboard should align to 14.2.x before production, see RISK_AND_ROLLBACK.md).

## 6. High-level phases (full detail in MIGRATION_PHASES.md)

| Phase | Name | Moves / outcome |
|---|---|---|
| 0 | Migration checkpoint | Clean git state both repos, DB backup verified, plan frozen. |
| 1 | Backend foundation in dashboard | Prisma schema + migrations + shared client + backend deps + env. No route cutover. |
| 2 | Read-only reference routes | `GET categories`, `GET types`, `GET posts`, `GET details` live on :3001. |
| 3 | Listing mutation routes | `POST/PUT/DELETE posts`, `details`, combined `postsDetails` PUT, Cloudinary behavior. |
| 4 | Reservations | `DateReserve` GET/POST + `[id]` GET/PUT/DELETE + post-status behavior. |
| 5 | Authentication and protection | `login`, JWT helpers, route protection, CORS, protect mutation routes. |
| 6 | Consumer cutover | Dashboard → own origin; public app → dashboard/backend origin; full regression. |
| 7 | Remove backend from public app | Delete API routes, Prisma, backend deps, secrets, dead server code. |
| 8 | Deployment and production cutover | Prod env, CORS domains, managed DB, smoke tests, rollback. |

**Invariant:** the public app never depends on its own `/api/**` after Phase 2 is
verified; old routes stay until Phase 6 regression proves zero consumers, then removed in
Phase 7. Database and migrations are copied, never re-created.

## 7. Success criteria (definition of done)

- Both apps build and pass lint/typecheck with **no new errors**.
- All 15 routes serve identical response shapes from `:3001` as they did from `:3000`.
- Public site renders listings end-to-end from the dashboard/backend origin.
- Full CRUD regression on the dashboard (posts, details, orders) passes.
- Login works, mutation routes are protected, CORS allow-list is correct.
- Cloudinary images upload on create, are preserved on update, destroyed on delete.
- Old API routes removed from `realestat`; public app is frontend-only.
- No schema/migration/data change; same database throughout.

## 8. Read-only confirmation

This document and the five sibling documents under `docs/migration/` are the ONLY outputs
of this audit. No source file, package file, Prisma schema, migration, commit, or push was
modified.
