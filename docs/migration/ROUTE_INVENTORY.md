# Route Inventory — Exact, Route by Route

Read-only inventory of every backend-owned item in `realestat` that must move, stay
temporarily, or be deleted. Cross-checked against `dashbord-realstat` consumers.

## 0. Legend

**Classification** (a route may carry several):
- `MOVE` — relocate to the dashboard backend.
- `KEEP TEMPORARILY` — leave a copy/route in the public app during dual-running only.
- `DELETE AFTER CUTOVER` — old copy removed once consumers point at the new origin.
- `DEAD / DELETE` — no active consumer and no planned use.
- `PUBLIC READ-ONLY` — consumed by the public frontend, GET only.
- `ADMIN MUTATION` — write operations used by the dashboard.
- `SHARED` — read by both apps.

**Complexity:** SMALL / MEDIUM / LARGE (based on Prisma surface, Cloudinary behavior,
auth, and consumer count).

## 1. Route groups

### 1.1 `/api/categories`

| Field | Value |
|---|---|
| Current path | `GET/POST /api/categories` |
| Current file | `realestat/src/app/api/categories/route.tsx` |
| Supported methods | GET, POST, OPTIONS |
| Prisma model | `Category` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none (no public component calls `/api/categories`) |
| Dashboard consumers | `src/contexts/post.jsx:21` (GET, fills dropdowns) |
| Response shape | GET → array of categories each including its full `posts` array (heavy); `?name=` → `category.posts`; POST → created category, 201 |
| Payload shape | POST `{ name }` |
| Known quirks | GET embeds full posts (images) per category → payload bloat; POST/PUT do not validate the `CategoryName` enum → bad value → Prisma error 500 |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | none (foundation: needs Prisma client only) |
| Classification | MOVE · ADMIN MUTATION · SHARED (dashboard-only reads today) |

### 1.2 `/api/categories/[id]`

| Field | Value |
|---|---|
| Current path | `GET/PUT/DELETE /api/categories/[id]` |
| Current file | `realestat/src/app/api/categories/[id]/route.tsx` |
| Supported methods | GET, PUT, DELETE, OPTIONS |
| Prisma model | `Category` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | none (no active caller found) |
| Response shape | GET → category 200/404; PUT → updated 200; DELETE → deleted 200 |
| Payload shape | PUT `{ name }` |
| Known quirks | id parsed via `url.split('/').pop()`; no enum validation |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | after 1.1 |
| Classification | MOVE · ADMIN MUTATION (no active consumer — verify before Phase 3; candidate for DELETE AFTER CUTOVER if the UI never calls it) |

### 1.3 `/api/types`

| Field | Value |
|---|---|
| Current path | `GET/POST /api/types` |
| Current file | `realestat/src/app/api/types/route.tsx` |
| Supported methods | GET, POST, OPTIONS |
| Prisma model | `Type` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | `src/contexts/post.jsx:34` (GET, fills dropdowns) |
| Response shape | GET → array of types incl. `posts`; `?name=` → `type.posts`; POST → created type 201 |
| Payload shape | POST `{ type }` |
| Known quirks | same enum-validation gap as categories |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | none |
| Classification | MOVE · ADMIN MUTATION · SHARED (dashboard-only reads today) |

### 1.4 `/api/types/[id]`

| Field | Value |
|---|---|
| Current path | `GET/PUT/DELETE /api/types/[id]` |
| Current file | `realestat/src/app/api/types/[id]/route.tsx` |
| Supported methods | GET, PUT, DELETE, OPTIONS |
| Prisma model | `Type` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | none (no active caller found) |
| Response shape | GET/PUT/DELETE → 200; 404/400 paths |
| Payload shape | PUT `{ type }` |
| Known quirks | same as 1.2 |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | after 1.3 |
| Classification | MOVE · ADMIN MUTATION (no active consumer — same caveat as 1.2) |

### 1.5 `/api/posts`

| Field | Value |
|---|---|
| Current path | `GET/POST /api/posts` |
| Current file | `realestat/src/app/api/posts/route.tsx` |
| Supported methods | GET, POST, OPTIONS |
| Prisma model | `Post`, `Category`, `Type`, `Detail` |
| Cloudinary | yes — `cloudinary.v2.config()` (`CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`); `.uploader.upload(folder:'realstat')` on POST |
| Auth today | none |
| Public app consumers | `popular-post.jsx:36,44`, `PopularPropertyCard.jsx:60,66`, `PropertyList.jsx:13,65`, `PropertyDetailModal.jsx:26` — all GET |
| Dashboard consumers | `contexts/post.jsx:45` (GET `fetchData`), `:106` (POST `createData`); `insert/page.jsx:151` (POST); posts table (GET via context) |
| Response shape | GET → array of posts (or single with `?id=`), each incl. `category`, `type`, `Detail`, and **full `DateReserve` rows**; POST → `{ id, post }` 201 |
| Payload shape | POST `{ lat, lon, prix, adress, ville, status, categoryId, typeId, Detail (JSON string), img (array, required), youtub, comment }` |
| Known quirks | GET **mutates state**: N+1 `post.update` calls flip `status` (Location-with-reservation auto `taken`/`available`; only posts *with* reservations are auto-flipped, admin-set status preserved for others); **PII leak**: `DateReserve` rows incl. `fullName`/`CIN`/`price` serialized to anonymous GET; `console.log("dw")`; `NODE_ENV`-gated debug blob in errors; title written twice per POST; `bathrooms`/`rooms` filter threshold (`≤4` exact, `≥5` = `gte:5`) |
| Duplicate/conflict | none (but see 1.7 which duplicates half its PUT logic) |
| Migration complexity | LARGE |
| Migration order dependency | must move together with 1.6 (shared `Post` surface); fix PII leak before cutover |
| Classification | MOVE · PUBLIC READ-ONLY (GET) · ADMIN MUTATION (POST) · SHARED |

### 1.6 `/api/posts/[id]`

| Field | Value |
|---|---|
| Current path | `GET/PUT/DELETE /api/posts/[id]` |
| Current file | `realestat/src/app/api/posts/[id]/route.tsx` |
| Supported methods | GET, PUT, DELETE, OPTIONS (OPTIONS absent; relies on middleware) |
| Prisma model | `Post`, `Detail`, `Category`, `Type` |
| Cloudinary | yes — config; `.uploader.upload` on PUT (new base64 images); `.uploader.destroy` on replaced images and on DELETE; `publicIdFromUrl()` regex (L15-18) |
| Auth today | none |
| Public app consumers | none directly (public fetches list + all details, filters client-side) |
| Dashboard consumers | `contexts/post.jsx:119` (PUT `updateData`), `:134` (DELETE `deleteData`); `update/[id]:99` (PUT); `All/[id]` fallback PUT; `show/[id]:54` (DELETE); `posts/page.jsx:84` (DELETE) |
| Response shape | GET → post 200/404; PUT → updated post 200; DELETE → `{message}` 200 |
| Payload shape | PUT `{ img[], lat, lon, prix, adress, ville, status, title, categoryId, typeId, youtub, comment }` |
| Known quirks | **PUT requires valid `status`** (partial update omitting it → 400); raw ids (no `parseInt`) passed to Prisma; id parsed via `url.split('/').pop()`; image diffing keeps existing Cloudinary URLs and re-uploads base64 only; destroy only images no longer referenced (fixed in prior sprint) |
| Duplicate/conflict | overlaps 1.7 |
| Migration complexity | LARGE |
| Migration order dependency | same phase as 1.5; Cloudinary delete behavior must be regression-tested |
| Classification | MOVE · ADMIN MUTATION |

### 1.7 `/api/postsDetails/[id]`

| Field | Value |
|---|---|
| Current path | `PUT /api/postsDetails/[id]` (no root `route.tsx` → `GET/POST /api/postsDetails` 404) |
| Current file | `realestat/src/app/api/postsDetails/[id]/route.tsx` |
| Supported methods | PUT, OPTIONS |
| Prisma model | `Post`, `Detail` |
| Cloudinary | yes — config; upload (folder `realstat`); destroy; own `publicIdFromUrl` (L22-25) |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | `All/[id]/page.jsx:168` (primary combined update path) |
| Response shape | `{message:"Update successful"}` 200; 404 if no Detail exists for the post |
| Payload shape | post fields + detail fields (`constructionyear, surface, rooms, bedromms, livingrooms, kitchen, bathrooms, furnished, floor, elevator, parking, balcony, pool, facade, documents, postId, Guard`) |
| Known quirks | **case-sensitive path** (`postsDetails`) — renamed from `postsdetails` in a prior sprint; duplicate ~half of 1.6 PUT logic; detail looked up by `postId`; generic 400 error handling |
| Duplicate/conflict | 1.6 (`posts/[id]` PUT) covers a subset; `postsDtails` typo route already deleted |
| Migration complexity | LARGE |
| Migration order dependency | after 1.5/1.6 (shares Cloudinary + Post/Detail surface); preserve exact casing in the destination repo |
| Classification | MOVE · ADMIN MUTATION |

### 1.8 `/api/details`

| Field | Value |
|---|---|
| Current path | `GET/POST /api/details` |
| Current file | `realestat/src/app/api/details/route.tsx` |
| Supported methods | GET, POST, OPTIONS |
| Prisma model | `Detail`, `Post` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | `popular-post.jsx:44`, `PopularPropertyCard.jsx:66`, `PropertyDetailModal.jsx:27` — GET all |
| Dashboard consumers | `contexts/post.jsx:62` (GET), `All/[id]` fallback (POST), `detail/[id]:62` (POST) |
| Response shape | GET → array of details incl. `post`; POST → `{ detail, updatedPost }` 201 (title recomputed with surface) |
| Payload shape | POST all Detail fields + `postId` (+ `Proprietary`, `Guard`) |
| Known quirks | raw-string `postId` in `connect`; duplicate Detail for a post → Prisma P2002 → 400; no query params; title regeneration on POST |
| Duplicate/conflict | none |
| Migration complexity | MEDIUM |
| Migration order dependency | same phase as 1.5 (public app merges posts+details client-side) |
| Classification | MOVE · PUBLIC READ-ONLY (GET) · ADMIN MUTATION (POST) · SHARED |

### 1.9 `/api/details/[id]`

| Field | Value |
|---|---|
| Current path | `GET/PUT /api/details/[id]` |
| Current file | `realestat/src/app/api/details/[id]/route.tsx` |
| Supported methods | GET, PUT, OPTIONS |
| Prisma model | `Detail` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none directly |
| Dashboard consumers | `All/[id]` fallback (PUT); `show/Update.jsx:67` (PUT — **dead component**, not reachable) |
| Response shape | detail 200/404 |
| Payload shape | PUT all Detail fields + `postId` |
| Known quirks | connects `post` even when `postId` undefined → potential error; id via `url.split('/').pop()` |
| Duplicate/conflict | none |
| Migration complexity | MEDIUM |
| Migration order dependency | after 1.8 |
| Classification | MOVE · ADMIN MUTATION |

### 1.10 `/api/DateReserve`

| Field | Value |
|---|---|
| Current path | `GET/POST /api/DateReserve` |
| Current file | `realestat/src/app/api/DateReserve/route.tsx` |
| Supported methods | GET, POST |
| Prisma model | `DateReserve`, `Post` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | `contexts/post.jsx:77` (GET `fetchOrders`), `:147` (POST `createOrder`); `OrderDialog.jsx:58` (POST) |
| Response shape | GET → array with each reservation expanded into `reservedDates` (full day list), `dateDebut`/`dateFine` as `YYYY-MM-DD`; POST → created reservation 201 |
| Payload shape | POST `{ dateDebut, dateFine, fullName, price, CIN, postId }` (requires `fullName`, `CIN`, `postId`) |
| Known quirks | **side-effect**: POST flips linked `Post.status` (`taken`/`available` by `CategoryName` + presence of `dateFine`); `parseFloat(price)` of undefined → NaN; no date-range validation (guard is commented out); `reservedDates` is O(range) expansion |
| Duplicate/conflict | none |
| Migration complexity | MEDIUM |
| Migration order dependency | after listings (1.5–1.9); status-flip logic must move with it |
| Classification | MOVE · ADMIN MUTATION |

### 1.11 `/api/DateReserve/[id]`

| Field | Value |
|---|---|
| Current path | `GET/PUT/DELETE /api/DateReserve/[id]` |
| Current file | `realestat/src/app/api/DateReserve/[id]/route.tsx` |
| Supported methods | GET, PUT, DELETE |
| Prisma model | `DateReserve` |
| Cloudinary | none |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | `OrderActions.tsx:42` (DELETE), `updateorder/[id]:50` (PUT), `contexts/post.jsx:160,175` (PUT/DELETE) |
| Response shape | GET → reservation incl. `post` 200/404; PUT → updated 200; DELETE → deleted record 200 |
| Payload shape | PUT `{ dateDebut, dateFine, fullName, price, CIN }` (partial) |
| Known quirks | uses `{ params }` (robust); no status side-effects on PUT/DELETE |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | after 1.10 |
| Classification | MOVE · ADMIN MUTATION |

### 1.12 `/api/partennaire` and `/api/partennaire/[id]`

| Field | Value |
|---|---|
| Current path | `POST /api/partennaire`, `PUT/DELETE /api/partennaire/[id]` |
| Current file | `realestat/src/app/api/partennaire/route.tsx`, `[id]/route.tsx` |
| Supported methods | POST (root); PUT, DELETE ([id]) |
| Prisma model | `Partennaire` |
| Cloudinary | none (logo is a raw string, not uploaded) |
| Auth today | none |
| Public app consumers | none |
| Dashboard consumers | none (zero references to `partennaire` in the dashboard repo) |
| Response shape | POST → created 201; PUT/DELETE → 200; `{error}` 400 |
| Payload shape | `{ name, logo }` |
| Known quirks | **no GET** — list impossible via API; `Partennaire` table-name typo in schema (no `@@map`) |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | none (isolated) |
| Classification | MOVE (admin mutation) with a hard recommendation: **DELETE AFTER CUTOVER** if the dashboard never gains a partner-management UI — no consumer exists today |

### 1.13 `/api/user`

| Field | Value |
|---|---|
| Current path | `POST /api/user` |
| Current file | `realestat/src/app/api/user/route.tsx` |
| Supported methods | POST |
| Prisma model | `User` (create with `bcrypt.hash(password, 10)`) |
| Cloudinary | none |
| Auth today | none — **unauthenticated user creation** |
| Public app consumers | none |
| Dashboard consumers | none (login page only authenticates an existing user) |
| Response shape | created user, 201 — **includes the bcrypt password hash** (data-exposure bug) |
| Payload shape | `{ email, password, phone, name }` |
| Known quirks | returns password hash to the client; no role model; no auth guard |
| Duplicate/conflict | none |
| Migration complexity | SMALL |
| Migration order dependency | after login (1.14) if kept; see classification |
| Classification | MOVE · ADMIN MUTATION with hard recommendations: **DELETE AFTER CUTOVER** (no consumer) or strip the password hash from the response if retained |

### 1.14 `/api/login`

| Field | Value |
|---|---|
| Current path | `POST /api/login` |
| Current file | `realestat/src/app/api/login/route.jsx` (only `.jsx` route) |
| Supported methods | POST, OPTIONS (OPTIONS returns bare 204 without middleware headers) |
| Prisma model | `User` (`findUnique` by email, `bcrypt.compare`) |
| Cloudinary | none |
| Auth today | issues JWT in the **response body**; the dashboard client stores it in a cookie (`token`) — API and cookie flow disagree |
| Public app consumers | none |
| Dashboard consumers | `login/page.tsx:51` (POST, reads `{ token }`, sets cookie `token` via react-cookie `{path:'/', secure:true, sameSite:'strict'}`, redirects) |
| Response shape | 200 `{ token, user: { email } }`; 401 `{ error: "Invalid email or password" }`; 500 `{ error: "Error logging in" }` |
| Payload shape | `{ email, password }` |
| Known quirks | **hardcoded `JWT_SECRET` fallback in source** (L7) — token forgery risk if env unset; `jsonwebtoken` HS256, payload `{userId}`, `expiresIn: '1h'`; no rate limiting/lockout; `setCorsHeaders` no-op; duplicate comment |
| Duplicate/conflict | `src/server.js` contains a mock `/api/login` (dead) |
| Migration complexity | MEDIUM |
| Migration order dependency | Phase 5; cookie-scope behavior must be re-evaluated when login becomes same-origin with the dashboard |
| Classification | MOVE · ADMIN MUTATION (authentication) |

## 2. Dead / duplicate / legacy inventory

| Item | Location | Why dead | Action |
|---|---|---|---|
| Express stub | `realestat/src/server.js` | mock `POST /api/login`, `GET /api/posts`, broken `app.use('api/categories', …)`; listens 3009, logs 3002; not referenced by any script | DELETE (Phase 7) |
| Config | `realestat/next.config.mjs` | self-redirect `/ → /`; build proves `next.config.js` is active | DELETE (Phase 7) |
| Cloudinary helper | `realestat/src/app/utils/cloudinary.js` | never imported (config duplicated in 4 route files) | DELETE (Phase 7) |
| Upload helper | `realestat/src/app/utils/upload.js` | multer/disk-storage, never imported | DELETE (Phase 7) |
| Per-route `OPTIONS` handlers + `setCorsHeaders` no-ops | 14 route files | middleware short-circuits OPTIONS; helpers are deliberate no-ops | Remove when rewriting each route in the destination |
| 15 × `new PrismaClient()` | all route files | no singleton; serverless connection risk | Replace with one shared client (Phase 1) |
| CI workflow | `realestat/.github/workflows/ci.yml` | **suspected secret-exfiltration payload** (base64 reverse-shell) | Remove/disable immediately (security) — flagged, not touched in this audit |
| Dashboard dead routes | `SearchPost.jsx`, `show/Update.jsx`, `infomodel.tsx`, `customers-filters.tsx`, `insert/map.jsx`, overview `sales/traffic/tasks-progress`, `integrations-card.tsx`, `user-popover.tsx`, `account/*`, `settings/*`, `update/[id]` (orphan), `background.js`/`content.js` | zero imports / commented out | Housekeeping in dashboard repo; not part of backend move |

## 3. Consumer → route matrix (who must be re-pointed)

| Consumer (file) | Routes used | Phase switch |
|---|---|---|
| `realestat` popular-post / PopularPropertyCard / PropertyList / PropertyDetailModal | GET `/api/posts`, `/api/details` | Phase 6 (public cutover) |
| `realestat` ContactForm ×2 | external `CONTACT_API_URL` | unchanged |
| `dashbord` contexts/post.jsx | categories, types, posts, posts/[id], details, DateReserve, DateReserve/[id] | per-phase (2→4) |
| `dashbord` login/page.tsx | `/api/login` | Phase 5 |
| `dashbord` All/[id], update/[id], insert, detail/[id], show/[id] | posts, postsDetails/[id], details | Phase 3 |
| `dashbord` OrderDialog, OrderActions, updateorder/[id] | DateReserve, DateReserve/[id] | Phase 4 |

## 4. Route counts

- **Active route files to move:** 15 (13 route groups).
- **Dead/duplicate to delete:** `src/server.js` (3 mock routes), `next.config.mjs`,
  `src/app/utils/cloudinary.js`, `src/app/utils/upload.js` → **4 legacy items**; plus
  per-route dead OPTIONS/no-op helpers cleaned in place, and 15 Prisma instances → 1.
