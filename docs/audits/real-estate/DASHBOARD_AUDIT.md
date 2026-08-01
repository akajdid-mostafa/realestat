# Dashboard Audit — `dashbord-realstat` (`/Users/ocean_dev2/Projects/dashbord-realstat`)

> Read-only audit. No files modified. Build: ✅ passes. Lint: ⚠️ 22 errors / 6 warnings. Typecheck: ✅ passes (`tsc --noEmit`). Tests: none.

## 1. Stack & structure

- **Next.js 14.2.4, App Router**, React 18, **Material UI v5**, Redux Toolkit, `axios` + native fetch, `bcryptjs`, `jsonwebtoken`, `react-hook-form`-style forms, OpenCage geocoding, Cloudinary upload.
- Name in `package.json`: **Immocean v4.0.0**.
- Git: branch `main`. **Uncommitted change in `src/contexts/post.jsx`** (API base switched from `https://realestat.vercel.app` → `http://localhost:3000`) and an untracked `env.example`.
- `next.config.mjs` redirects `/Index` → `/login`.

## 2. Routes inventory (`src/app`)

| Route | File | Notes |
|---|---|---|
| `/login` | `src/app/login/page.jsx` | Login; posts to `https://realestat.vercel.app/api/login` (dead host). |
| `/dashboard` | `src/app/dashboard/page.jsx` | Landing; fetch from `localhost:3000`. |
| `/dashboard/posts` | `.../posts/page.jsx` | List posts (via context). |
| `/dashboard/insert` | `.../insert/page.jsx` | Create post (form → Cloudinary upload → API). |
| `/dashboard/orders` | `.../orders/page.jsx` | Orders list; **client-rendered, unpersisted**. |
| `/dashboard/detail/[id]` | `.../detail/[id]/page.jsx` | Edit details of a post (detail via `localhost`, save via `realestat.vercel.app`). |
| `/dashboard/show/[id]` | `.../show/[id]/page.jsx` | View post (mixed hosts). |
| `/dashboard/showorder/[id]` | `.../showorder/[id]/page.jsx` | **Empty stub** — renders nothing. |
| `/dashboard/update/[id]` | `.../update/[id]/page.jsx` | Edit post (fetch + save to `realestat.vercel.app`). |
| `/dashboard/updateorder/[id]` | `.../updateorder/[id]/page.jsx` | Edit order (posts to `realestat.vercel.app`). |
| `/dashboard/All/[id]` | `.../All/[id]/page.jsx` | Detail sub-view (via context). |
| `/dashboard/OrderDialog` | `.../OrderDialog/page.jsx` | Dialog route; uses `realestat.vercel.app`. |

Plus shared components: `OrderActions`, `LatestOrders`, `integrations-filters`, `OrderDetails`, `side-nav`, `main-nav`, `config.tsx`.

## 3. Data layer (`src/contexts/post.jsx`)

- Central Redux provider wrapping the app; holds posts, details, orders, and does the CRUD.
- **Current working copy** points at `http://localhost:3000/api/*` for categories, types, posts, details, and DateReserve — i.e., dashboard only works against a **locally running public app**.
- Home/feed/member stats fetch also `localhost:3000`.
- Cookies: `getToken()`/`getUserId()` read from a cookie named `token` (JWT).
- No shared `API_URL` constant — base URL is repeated inline throughout the file and pages.

## 4. Auth

- Login posts to `https://realestat.vercel.app/api/login` (dead), stores JWT in cookie `token`.
- `src/middleware.ts` only checks that a `token` cookie exists — **no signature/expiry validation**, no redirect back-end check; a forged cookie passes.
- No role concept — any valid token is "admin".
- Credentials (email/password) sent as JSON over HTTP in dev; over the dead HTTPS host in prod.

## 5. Orders ("commandes")

- Orders are **never persisted** server-side: there is no Prisma model, no API route. They are built client-side from `DateReserve`-like data and stored in context/local state.
- `showorder/[id]` is an empty stub — the "order detail" page shows nothing.
- `updateorder/[id]` posts order data to a route that does not exist server-side.

## 6. Code-quality issues

- Lint: 22 errors / 6 warnings — `@typescript-eslint/no-unused-vars`, `no-explicit-any`, `react-hooks/exhaustive-deps`, `react/no-unescaped-entities`.
- Bug: `show/Update.jsx:28` — `console.log=("detail",...)` is an **assignment to `console.log`**, not a call (would throw when evaluated).
- `any`-typed props everywhere (`data`), no shared TypeScript model for Post/Detail.
- Mixed fetch styles (`axios` and `fetch`) across files.
- `main-nav`/`side-nav` MUI vs `next/link` inconsistencies.
- Duplicate config: `tailwind.config.js` + `tailwind.config.ts`; Tailwind CSS present but unused (MUI drives styling) → build-time content warning.
- Forms use raw `useState` handlers; no validation library on insert/update.

## 7. Verified / Unverified status

| Area | Status |
|---|---|
| Production build | ✅ passes |
| Lint | ⚠️ 22 E / 6 W |
| Typecheck | ✅ passes |
| Tests | ❌ none |
| Login → live backend | ❌ broken (dead host) |
| CRUD against local API | ⚠️ works only with public app running on port 3000 |
| Orders persistence | ❌ none |

## 8. Top fixes (priority order)

1. Centralize API base URL in one env-driven constant (`NEXT_PUBLIC_API_URL`) and remove the uncommitted `localhost` override before commit.
2. Redeploy the public app so the dashboard has a live backend.
3. Implement server-side auth (JWT verify with expiry in middleware + API routes) and role checks.
4. Decide Orders: add a real model + routes, or drop the Orders UI.
5. Fix `console.log` assignment bug in `show/Update.jsx`.
6. Add shared TS types for Post/Detail and enforce via `tsc` in CI.
