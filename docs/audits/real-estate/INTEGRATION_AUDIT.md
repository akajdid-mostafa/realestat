# Integration Audit — How the two apps talk to each other

> Read-only audit. Focus: cross-app API wiring, environment configuration, and shared data contracts.

## 1. Topology

```
┌─────────────────────┐         ┌─────────────────────────┐
│ dashbord-realstat   │  ────►  │ realestat (public app)  │
│ (admin, MUI, App    │  fetch  │  /api/** + Prisma + Neon│
│  Router)            │         │  (Pages Router)         │
└─────────────────────┘         └───────────┬─────────────┘
                                            │
                      ┌─────────────────────┴────────────┐
                      │ sendmailimmocean.onrender.com     │
                      │  (email sender, used by public    │
                      │   contact forms)                  │
                      └──────────────────────────────────┘
```

The dashboard has **no database of its own** — it is a thin client over the public app's REST API. This makes the public app a single point of failure for the whole product.

## 2. Hardcoded base URLs inventory (per file)

**Public app (`realestat`) — consumer of its own API:**
- `src/components/properties/PropertyList.jsx:12` → `https://realestat.vercel.app/api/posts`
- `src/components/properties/PropertyDetailModal.jsx:25-26` → posts + details
- `src/components/properties/PopularPropertyCard.jsx:59,65` → posts + details
- `src/components/properties/popular-post.jsx:35,43` → posts + details
- `src/components/Index/ContactForm.jsx:37` → `https://sendmailimmocean.onrender.com/Email`
- `src/components/properties/contact.jsx:77` → `https://sendmailimmocean.onrender.com/Email`
- `PropertySumary.jsx:133`, `PopularPropertyCard.jsx:229`, `popular-post.jsx:252,395` → WhatsApp share embeds `http://localhost:3000/...`

**Dashboard (`dashbord-realstat`):**
- `src/contexts/post.jsx` → **currently `http://localhost:3000/api/*`** (uncommitted change from `https://realestat.vercel.app`)
- `src/app/login/page.jsx` → `https://realestat.vercel.app/api/login` (still dead host)
- `src/app/dashboard/OrderDialog/page.jsx`, `components/OrderActions.jsx`, `components/LatestOrders.jsx`, `dashboard/update/[id]`, `dashboard/detail/[id]`, `dashboard/show/[id]`, `dashboard/updateorder/[id]` → `https://realestat.vercel.app/api/*`

**Result:** the two apps disagree on where the backend is. The dashboard will (a) fail login entirely and (b) work for most CRUD only if `realestat` runs locally on port 3000 — and even then `detail/[id]`/`update/[id]` etc. will throw because they still target the dead Vercel host.

## 3. Live deployment status (checked at audit time)

| Host | Result |
|---|---|
| `https://realestat.vercel.app/` | **HTTP 404 `DEPLOYMENT_NOT_FOUND`** — deployment deleted |
| `https://realestat.vercel.app/api/posts` | same 404 |
| `https://sendmailimmocean.onrender.com/Email` | **HTTP 404** |
| `http://localhost:3000` | works only when the public app dev server is running locally |

**Bottom line:** there is currently **no reachable production backend**, so neither app functions end-to-end in a deployed state.

## 4. Data-contract mismatches (server ↔ clients)

- **Naming drift:** public app uses `bedromms` (typo), `Partennaire`, `DateReserve`; dashboard form fields use similar-but-inconsistent keys; the `postsDtails` (typo) route mirrors `postsdetails`.
- **`prix`/`lat`/`lon` as strings** server-side but treated as numbers in UI (sorting, maps).
- **Details are a separate endpoint** (`/api/details`) — the dashboard and public site each issue two requests per property (post + detail) and merge them client-side; no single aggregate endpoint exists.
- **Orders:** dashboard shows orders built from local/context state; the server has no Order model → save/update order actions hit endpoints that do not exist.
- **DateReserve:** route exists but returns all dates for all posts; no `[id]` scoping; dashboard doesn't actually consume it consistently.

## 5. Configuration & secrets

- `.env` files are **gitignored in both repos** ✅. Values (Neon URL, Cloudinary, JWT secret, OpenCage key) must never be committed.
- No `.env.example` in the public repo; the dashboard has an untracked `env.example`.
- `NEXT_PUBLIC_OPENCAGE_API_KEY` exists in the dashboard `.env`; public app geocoding uses hardcoded Cloudinary/maps config.
- `NEXT_PUBLIC_SITE_URL` in the dashboard `.env` is a placeholder (`https://your-domain.com`).

## 6. Security integration issues

- `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` across all API routes (invalid, and wide open).
- Three competing CORS implementations (route helpers + `middleware.ts` stub with fake `acme.com`/`my-app.org` + `next.config.js` headers).
- Login token stored in a cookie read only by presence; no server-side session; password hashing exists (bcrypt) but route login still exposes timing/log noise.
- No rate limiting on login or contact endpoints.
- Contact forms POST to an external service with no allowed-origin check and no CSRF token.

## 7. What works today

- ✅ Local-dev flow: run `realestat` on :3000 → dashboard CRUD via `localhost` context works for posts/categories/types/details.
- ✅ Prisma schema compiles; DB migrations exist in repo (no migrations executed during audit).
- ✅ Cloudinary upload flow wired in dashboard insert/update.

## 8. What is broken today

- ❌ Public site home (Popular) and properties list (dead Vercel host).
- ❌ Dashboard login (dead Vercel host).
- ❌ Public contact forms (dead onrender host).
- ❌ Dashboard detail/update/show pages (still hardcoded to dead Vercel host).
- ❌ WhatsApp share URLs embed `localhost:3000`.
- ❌ Orders end-to-end (no persistence anywhere).

## 9. Recommended integration model (target)

1. **One env-driven base URL** on both sides: `NEXT_PUBLIC_API_URL=https://api.<domain>`.
2. **Redeploy the public app** as the shared API; put it behind a stable custom domain.
3. **Aggregate endpoint** e.g. `GET /api/properties` returning `{post, detail, dates, category, type}` in one round-trip; keep dashboard on the same endpoints.
4. **Move email** into the public app (own route) or a healthy send service; stop external hardcoded host.
5. **Make orders real** (add Prisma model + routes) or remove from dashboard.
6. **Single CORS policy** with explicit origin allow-list; token verification in middleware.
