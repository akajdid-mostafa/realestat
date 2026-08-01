# Next Steps — Remediation Plan (7 phases)

> Read-only audit. This is a plan; **no code changes were made during the audit.** Work each phase in order; each ends with a verification step.

## Phase 0 — Restore a live backend (the single biggest blocker)

**Why first:** every broken flow (home listings, properties, login, contact, detail/update pages) traces to the dead `realestat.vercel.app` deployment.

- [ ] Redeploy the public app (`realestat`) to Vercel (or any host), using the existing Neon Postgres + Cloudinary + env config.
- [ ] Confirm `GET {api}/api/posts` returns 200 with data.
- [ ] Confirm `POST {api}/api/login` works and returns a JWT.
- [ ] Record the final base URL (e.g. `https://realestat-xxx.vercel.app`).

**Verify:** `curl {api}/api/posts` → 200 JSON array.

## Phase 1 — Centralize and fix the API base URL on both sides

- [ ] Add `NEXT_PUBLIC_API_URL` to both `.env` files (and their `.env.example`).
- [ ] Replace **every** hardcoded `realestat.vercel.app` / `localhost:3000` in:
  - Public: `PropertyList.jsx`, `PropertyDetailModal.jsx`, `PopularPropertyCard.jsx`, `popular-post.jsx`.
  - Dashboard: `src/contexts/post.jsx` (revert the localhost override to env), `login/page.jsx`, `OrderDialog`, `OrderActions`, `LatestOrders`, `update/[id]`, `detail/[id]`, `show/[id]`, `updateorder/[id]`.
- [ ] Revert the uncommitted `localhost:3000` change in `src/contexts/post.jsx` before committing.
- [ ] Fix WhatsApp share URLs (`PropertySumary`, `PopularPropertyCard`, `popular-post`) to use the env site URL.

**Verify:** grep for `realestat.vercel.app`, `localhost:3000` → zero hits outside docs/README.

## Phase 2 — Contact forms / email

- [ ] Decide between fixing `sendmailimmocean.onrender.com` or moving email into a public-app API route.
- [ ] Recommended: add `POST /api/contact` in `realestat` (server-side email via a provider) and point both `ContactForm.jsx` and `properties/contact.jsx` at it.
- [ ] Remove `alert()`-based feedback; use inline UI states.

**Verify:** submit form locally → email received (or 200 + queued response).

## Phase 3 — Security hardening

- [ ] JWT: verify signature + expiry in dashboard `middleware.ts` (cookie-presence is not enough).
- [ ] Guard all mutating API routes in `realestat` (`POST/PUT/DELETE`) with a valid-token check (middleware or per-route helper).
- [ ] Remove the hardcoded JWT fallback secret in `login/route.jsx`; require env.
- [ ] Single CORS policy: keep one mechanism (e.g. `next.config.js` headers) with an explicit origin allow-list; delete the per-route `setCorsHeaders` helpers and the `middleware.ts` stub (or fix its hardcoded `acme.com`/`my-app.org`).
- [ ] Add rate limiting on `/api/login` and `/api/contact`.

**Verify:** unauthenticated POST to `/api/posts` → 401; CORS preflight from unknown origin → rejected.

## Phase 4 — Data model & schema cleanup

- [ ] Migrate `Post.prix`, `lat`, `lon` from strings to `Decimal`/`Float` (with migration).
- [ ] Add indexes on `status`, `ville`, `categoryId`.
- [ ] Merge duplicate routes `postsdetails`/`postsDtails`; add `dateReserve/[id]`.
- [ ] Add **Order** model + routes (see Phase 5) or remove the dashboard Orders UI.
- [ ] Single shared `PrismaClient` (avoid per-request instantiation).

**Verify:** `npx prisma migrate dev` succeeds; `npm run build` still passes.

## Phase 5 — Product completeness

- [ ] **Orders:** add `Order` (or `Reservation`) model with status + post linkage; add API CRUD; wire `orders` page + `OrderDialog` + `updateorder/[id]`; implement `showorder/[id]`.
- [ ] **Gallery:** implement `/gallery` + `/gallery/[id]` real content (currently stubs) or remove from nav.
- [ ] **Search:** add server-side search/pagination (accept `q`, `ville`, `categoryId`, `page`) and use it in `PropertyList`.

**Verify:** create order → appears in dashboard → detail page renders; gallery shows content.

## Phase 6 — Quality gate & portfolio polish

- [ ] Lint to **zero errors** in both repos (`npm run lint`).
- [ ] Add a minimal test suite (e.g. Vitest/Jest): API route test for `GET /api/posts`, login test, one e2e browse→filter→detail.
- [ ] Remove dead files: `next.config.mjs`, `src/server.js`, duplicate `fillter.jsx`/`filter.jsx`, `Index/Filter .jsx`, stub pages (or implement), `data.js` Firebase leftovers.
- [ ] Fix code bugs: `show/Update.jsx:28` `console.log=(...)` assignment; `console.log("dsd")` in `contact.jsx`.
- [ ] Align `tailwind.config.js`/`.ts` duplication; remove Tailwind if unused.
- [ ] Add `env.example` to the public repo; keep `.env` out of git.
- [ ] Deploy both apps; run a full manual smoke test of every flow in PRODUCT_FLOW.md.

**Verify:** `npm run lint` → 0 errors; `npm run build` passes; full flow checklist green; `git status` clean after commit.
