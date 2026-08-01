# Public App Audit — `realestat` (`/Users/ocean_dev2/Projects/realestat`)

> Read-only audit. No files modified. Build: ✅ passes. Lint: ⚠️ 25 errors / 2 warnings. Tests: none.

## 1. Stack & structure

- **Next.js 14.2.5, Pages Router**, React 18, Chakra UI v2, Prisma + PostgreSQL (Neon), Cloudinary for images.
- Name in `package.json`: `oceaan`. Node engine not pinned.
- Conflicting config files:
  - `next.config.js` — redirects `/` → `/Index` (used for Pages Router URL normalization).
  - `next.config.mjs` — **dead duplicate** that self-redirects `/Index` → `/Index`; only one of the two is actually applied.
- Folder split: `src/pages/**` (pages), `src/components/**` (UI), `src/app/api/**` (REST backend), `prisma/` (schema), `src/server.js` (dead Express stub listening on 3009, logs "3002").

## 2. Pages inventory

| Route | File | Notes |
|---|---|---|
| `/Index` | `src/pages/Index.jsx` | Home. Fetches popular posts from hardcoded `realestat.vercel.app`. 1s fake loading gate. |
| `/properties` | `src/pages/properties.jsx` | List + filter + detail modal (all data from hardcoded API). |
| `/about` | `src/pages/about.jsx` | Static content. |
| `/contact` | `src/pages/contact.jsx` | Contact form → `sendmailimmocean.onrender.com/Email` (dead, 404). |
| `/service` | `src/pages/service.jsx` | Static content. |
| `/gallery` + `/gallery/[id]` | `src/pages/gallery/**` | **Empty stub pages** — render nothing meaningful. |
| `/404` | default | Custom error page. |

- Every page manually wraps in `ChakraBaseProvider theme` (no shared `_app`), causing provider duplication and slow hydration.
- SEO/meta is handled by a `Layout` component; no `<Head>` metadata on most pages.

## 3. Data fetching & hardcoded hosts

- `src/components/properties/PropertyList.jsx:12` — `POSTS_API_URL = 'https://realestat.vercel.app/api/posts'` (page filter fetch). **Host is dead (404).**
- `PropertyDetailModal.jsx:25-26` — posts + details from same dead host.
- `PopularPropertyCard.jsx:59,65` and `popular-post.jsx:35,43` — home "Popular" section fetch posts + details from dead host.
- `Index/ContactForm.jsx:37` and `properties/contact.jsx:77` — POST to `https://sendmailimmocean.onrender.com/Email` (dead, 404). Contact form shows success/failure via `alert()`.
- WhatsApp share links in `PropertySumary.jsx:133`, `PopularPropertyCard.jsx:229`, `popular-post.jsx:252,395` embed `http://localhost:3000/properties?modal=yes&id=...` — dev URL in a public share message.
- No `NEXT_PUBLIC_API_URL` env usage anywhere — every base URL is hardcoded.

## 4. API layer (`src/app/api`) — notable findings

- **No authentication on any data route** (posts, details, categories, types, dateReserve, partennaire). Any public user can create/update/delete records by calling the routes directly.
- **No authorization** on `[id]` PUT/DELETE routes (e.g., `posts/[id]`, `categories/[id]`, `types/[id]`, `partennaire/[id]`).
- JWT: `login/route.jsx` signs with a **hardcoded fallback secret** in code if env missing; middleware (`src/middleware.ts`) only checks for a `token` cookie's **presence**, never validity or expiry. `posts` POST/PUT do not verify the token.
- **CORS:** every route sets `Access-Control-Allow-Origin: *` **plus** `Access-Control-Allow-Credentials: true` (an invalid combination) via a `setCorsHeaders` helper duplicated ~10×; `middleware.ts` is a second, separate CORS stub that would rewrite origins to hardcoded `acme.com`/`my-app.org` if it were active; `next.config.js` adds a third headers layer. Three competing CORS mechanisms.
- **Duplicate routes:** `postsdetails/[id]` vs `postsDtails/[id]` (typo twin, near-identical logic) — both behind `Details` GET/PUT and `Post` DELETE/PUT. Two PrismaClient instances per route file (not shared).
- `dateReserve` route lives in folder `dateReserve` with capital `R`; only index route present (no `[id]`).
- Route body parsing is untyped (`req.json()` into `any`) — no validation/sanitization (e.g., `prix` is stored as a string, `lat`/`lon` as strings).
- IDs parsed via `req.url.split('/').pop()` instead of Next `params` in several routes (fragile with query strings).

## 5. Data-model smells (Prisma schema)

- `Post.prix` is a **string** — cannot sort/filter numerically.
- `lat`/`lon` are strings, not floats.
- `Detail.furnished`, `Guard`, `Proprietary` are nullable booleans/strings — inconsistent with UI checkboxes.
- No `Order`/`Reservation` table for dashboard "orders" (DateReserve is the only reservation artifact).
- `DateReserve` name/type casing inconsistent with rest of schema.
- No indexes on commonly filtered columns (`status`, `ville`, `categoryId`).

## 6. Code-quality issues

- Lint: 25 errors / 2 warnings — mostly `react/no-unescaped-entities` (bare apostrophes in JSX) and `<img>` with no alt.
- Leftover debug: `console.log("dsd")` in `properties/contact.jsx:26`; `console.log` of full `detail` object in dashboard.
- Mock gallery data in `src/components/data.js` points at **Firebase URLs from a different project** (`oceangallery-d06ae`) — dead/leftover from another product.
- Duplicate components: `properties/fillter.jsx` + `properties/filter.jsx` (nearly identical), `Index/Filter .jsx` (filename contains a space — import-fragile).
- `Loading.jsx` gates most pages with a hardcoded 1s timer before showing content.

## 7. Verified / Unverified status

| Area | Status |
|---|---|
| Production build | ✅ passes |
| Lint | ⚠️ 25 E / 2 W |
| Tests | ❌ none |
| Live API (`realestat.vercel.app`) | ❌ HTTP 404 `DEPLOYMENT_NOT_FOUND` |
| Live email service (`onrender.com/Email`) | ❌ HTTP 404 |
| Home + Properties data loading | ❌ broken (dead host) |
| Contact form submission | ❌ broken (dead host) |
| Local dev against local API | ⚠️ works only if public app runs on port 3000 |

## 8. Top fixes (priority order)

1. Deploy the public app to a live host and centralize the API base URL into a single `NEXT_PUBLIC_API_URL`.
2. Remove/merge dead config (`next.config.mjs`, `src/server.js`, duplicate filter/detail components).
3. Add authentication + authorization to all mutating API routes; validate request bodies.
4. Fix CORS to a single mechanism with an explicit origin allow-list.
5. Convert `prix`, `lat`, `lon` to numeric DB types.
6. Fix broken contact-form host, remove `localhost` from WhatsApp share links, and populate gallery pages.
