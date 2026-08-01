# Product Overview — Real-Estate Platform ("Immocean")

> Read-only code audit. Generated from static inspection of two codebases; no source files were modified.

## 1. What the product is

A bilingual (French/English) real-estate listing platform with two front-ends sharing one API + database:

| Repo | Path | Role | Stack |
|---|---|---|---|
| `realestat` | `/Users/ocean_dev2/Projects/realestat` | **Public website** ("oceaan") — property listings, search/filter, detail view, contact forms, WhatsApp share | Next.js **14.2.5**, **Pages Router**, Chakra UI v2, Prisma + PostgreSQL (Neon) |
| `dashbord-realstat` | `/Users/ocean_dev2/Projects/dashbord-realstat` | **Admin dashboard** ("Immocean" v4.0.0) — post CRUD, orders, detail editing, image upload, login | Next.js **14.2.4**, **App Router**, Material UI v5, Redux Toolkit, `bcryptjs` + `jsonwebtoken` |

- The **public app is the backend**: all Prisma models and REST API routes live under `realestat/src/app/api/**`. The dashboard consumes those routes remotely.
- Deployment targets referenced in code: `https://realestat.vercel.app` (public app) and `https://sendmailimmocean.onrender.com` (a separate email-sender service).

## 2. Data model (Prisma schema — public app, source of truth)

- **User** — `id`, `email`, `password` (hashed with bcrypt), `phone`, `name` (admin credential owner).
- **Post** — the listing core: `img Json[]` (Cloudinary URLs), `lat`/`lon` (string), `prix` (string, not numeric), `adress`, `ville`, `status` enum (`ONLINE`/`OFFLINE`), `title`, `comment`, `youtub` (video embed), plus FK `categoryId`, `typeId`, and one-to-one **Detail** + many **DateReserve**.
- **Category** / **Type** — simple lookup tables (`name` / `type`).
- **Detail** — one-to-one with Post: `constructionyear`, `surface`, `rooms`, `bedromms`, `livingrooms`, `kitchen`, `bathrooms`, `furnished`, `floor`, `elevator`, `parking`, `balcony`, `pool`, `facade`, `documents`, `Guard`, `Proprietary`.
- **Partennaire** — partner/logo list (`name`, `logo`).
- **DateReserve** — reservation dates linked to a Post.
- No **Order** model exists in Prisma — "orders" on the dashboard are **not persisted** (see Integration Audit).

## 3. API surface (public app — all under `src/app/api`)

- `auth`: `login` (JWT sign, `httpOnly`-set cookie), `register` (no client uses it), `logout` (cookie clear).
- `posts` (+ `[id]`), `categories` (+ `[id]`), `types` (+ `[id]`), `details` (+ `[id]`), `dateReserve` (index-only), `partennaire` (+ `[id]`, PUT/DELETE only).
- Duplicates / oddities: `postsdetails/[id]` vs `postsDtails/[id]` (near-identical typo twins); `DateReserve` route at `dateReserve` with capital-letter folder; `src/server.js` is a dead Express stub.

## 4. Hosting & environment

- **`.env` files are gitignored in both repos** — good. Both contain real credentials (Neon Postgres URL, Cloudinary keys, JWT secrets, OpenCage API key). **Never commit these.**
- `https://realestat.vercel.app` currently returns **HTTP 404 `DEPLOYMENT_NOT_FOUND`** (deployment was deleted). `https://sendmailimmocean.onrender.com/Email` also returns **HTTP 404**. Any code pointing at these hosts is currently **broken**.
- The dashboard's working copy points to `http://localhost:3000/api/*` for most CRUD, i.e., it only works against a **locally running** public app right now.

## 5. Headline health

- Both apps **build successfully** (`npm run build`). `ignoreDuringBuilds: true` is set in both Next configs, so type/lint errors do not fail builds.
- Public app lint: **25 errors / 2 warnings**. Dashboard lint: **22 errors / 6 warnings**. Dashboard typecheck (`tsc --noEmit`): **passes**.
- **No tests** exist in either repository.
- Auth is **cookie-presence only** (middleware checks that a `token` cookie exists, not that it is valid), and the API routes are unauthenticated.

## 6. Summary of architecture risk

The two apps are glued together by **hardcoded base URLs** (`realestat.vercel.app`, `localhost:3000`, `onrender.com`) that disagree with each other and point at a **dead deployment**. The data model has no Order/booking persistence, and the public site's most-visited sections (home "Popular" and the properties list) fetch from a host that no longer exists. This is the single biggest blocker: **no live shared backend, so the product cannot function end-to-end until an API host is re-deployed and all hardcoded URLs are centralized.**
