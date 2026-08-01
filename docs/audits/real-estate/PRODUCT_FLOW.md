# Product Flow — End-to-end user journeys (as implemented in code)

> Read-only audit. Each flow describes what the code does today, with the blocking points.

## 1. Visitor on public site → browses properties

1. Land on `/` → redirected to `/Index` (`next.config.js`).
2. `/Index` renders Hero, **Popular** (fetches `https://realestat.vercel.app/api/posts` + `/api/details`), services, financing steps, about, counters, CTA, contact form.
3. **BLOCKED**: the Popular fetch hits a dead host → section errors/empty on production.

## 2. Property search & filter

1. `/properties` renders `PropertyList`.
2. Filters (`fillter.jsx`/`filter.jsx`) apply city/type/category/price constraints client-side after fetching `/api/posts`.
3. Clicking a card opens `PropertyDetailModal` (fetches detail for the property id).
4. **BLOCKED**: same dead host; filter/pagination logic is duplicated in two near-identical files.

## 3. Property detail

- Detail modal/summary shows images (Cloudinary), price, address, features from `Detail`, embedded YouTube, map, WhatsApp share.
- WhatsApp share links embed `http://localhost:3000/properties?modal=yes&id=...` — wrong host for production shares.

## 4. Contact / lead capture

- Public contact form + home contact form POST to `https://sendmailimmocean.onrender.com/Email`.
- **BLOCKED**: host returns 404 → leads are lost. No server-side storage fallback.

## 5. Admin login

1. Dashboard `/login` → POST to `https://realestat.vercel.app/api/login` → JWT cookie `token`.
2. **BLOCKED**: dead host. Even if login worked, middleware only checks cookie presence.

## 6. Admin manages posts (insert / update / delete)

1. `/dashboard/insert` — form (images→Cloudinary, title, address, price, features, YouTube) → POST via context to `http://localhost:3000/api/posts` (working copy) → then `/api/details`.
2. `/dashboard/posts` lists posts via context (localhost).
3. `/dashboard/update/[id]` — loads post + detail from `https://realestat.vercel.app` (dead) → save would also go there. **BLOCKED.**
4. `/dashboard/detail/[id]`, `/dashboard/show/[id]` — mixed hosts; detail edit loads from localhost but saves to dead host. **PARTIALLY BLOCKED.**
5. Delete flows through context → localhost. OK locally, nothing in production.

## 7. Admin manages orders

- Orders appear on `/dashboard/orders` (client-built from context state), details on `OrderDialog`.
- **No server persistence.** `showorder/[id]` renders nothing; `updateorder/[id]` posts to a non-existent server route.
- **Not functional** even locally beyond the in-memory list.

## 8. Shared data loading pattern

- Both apps merge `posts` + `details` into one logical property client-side (two HTTP requests per item, no pagination server-side, no caching layer).
- Home loads all posts for "Popular"; properties page loads all posts then filters client-side — no server-side search or pagination.

## Flow health summary

| Flow | Status |
|---|---|
| Browse home / listings | ❌ broken (dead API) |
| Filter & view detail | ❌ broken (dead API) |
| Contact form leads | ❌ broken (dead email host) |
| WhatsApp share | ⚠️ wrong host embedded |
| Admin login | ❌ broken (dead API) |
| Admin post CRUD | ⚠️ local-only, mixed hosts |
| Admin orders | ❌ not persisted / stub pages |
| Admin detail editing | ⚠️ half-broken (mixed hosts) |
