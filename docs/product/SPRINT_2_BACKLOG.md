# Sprint 2 Backlog

Status classification is **evidence-based**: every feature was verified against the current codebase
(`/Users/ocean_dev2/Projects/realestat` = public app, `/Users/ocean_dev2/Projects/dashbord-realstat` = dashboard)
and the audits in `docs/audits/real-estate/` on **2026-08-01**, **after** the Sprint 1 (local integration) and
Sprint 1.1 (auth verification) fixes were committed. Audit claims superseded by Sprint 1/1.1 fixes are noted
per feature.

## Status legend

- **Working** — verified functional in the current local environment (public :3000, dashboard :3001); no known defect.
- **Partial** — implemented but with known gaps, defects, or hard dependencies on the (currently dead) production stack.
- **Missing** — not implemented, an empty stub, or non-functional.
- **Unknown** — could not be verified from available evidence. (None remain after source verification.)

> Scope note: "Working" reflects a local verification environment. There is **no live production deployment**
> (dead `realestat.vercel.app` + `sendmailimmocean.onrender.com`), so every API-backed feature is production-dead
> until F33 is closed.

---

## 1. Product Goal

A bilingual (FR/EN) real-estate platform where:

1. The **public site** lets visitors browse, search, and view listings, and reliably send contact/lead requests.
2. The **admin dashboard** lets staff authenticate, manage listings with images, and manage orders, categories, and types.
3. The whole platform runs on a **live production deployment** behind a **secure, tested, clean codebase**
   (authenticated mutating API, validated JWTs, server-side search/pagination, zero lint errors, a passing test suite).

## 2. MVP Definition

The MVP is reached when every **P0** feature is Working and the full flow is verified end-to-end:

1. Live deployment of public app + dashboard + backend/DB reachable at production URLs (F33).
2. Public users can browse, search, filter, and view listing details served from the live API (F01, F02, F03).
3. Contact/lead requests are actually delivered and stored, not silently dropped (F06).
4. Admin can log in, keep a session, and perform full listing CRUD (create with images, list, update, delete) (F10–F15, F17).
5. Mutating API routes reject unauthenticated requests and tokens are signature/expiry-validated (F30, F13).
6. Configuration and CORS are correct for the production domain, with managed secrets (F31, F32, F40).
7. A minimal automated test suite covers the API and login (F34).

## 3. Complete Feature Inventory

| ID | Feature | Domain |
|----|---------|--------|
| F01 | Public listing browsing (home "Popular" + properties) | Public app |
| F02 | Property search & filter | Public app |
| F03 | Property detail view (modal: images, map, YouTube, WhatsApp) | Public app |
| F04 | WhatsApp share links | Public app |
| F05 | Contact form UI (ContactForm + properties/contact) | Public app |
| F06 | Lead/contact delivery (send + store) | Public app / Backend |
| F07 | Gallery section | Public app |
| F08 | Partners (Partennaire) section | Public app |
| F09 | Bilingual FR/EN content | Public app |
| F10 | Admin login (UI + JWT cookie) | Dashboard |
| F11 | Session persistence across refresh | Dashboard |
| F12 | Route protection (redirect to /login) | Dashboard |
| F13 | JWT signature/expiry validation | Dashboard / Backend |
| F14 | Logout | Dashboard |
| F15 | Posts CRUD UI (list, insert, update, show, All, detail) | Dashboard |
| F16 | Dashboard post search | Dashboard |
| F17 | Image upload (Cloudinary) | Dashboard |
| F18 | Category/Type management UI | Dashboard |
| F19 | Orders UI (list, OrderDialog, updateorder) | Dashboard |
| F20 | Orders persistence & API | Backend |
| F21 | Map / OpenCage geocoding in listing forms | Dashboard |
| F22 | Posts API (GET/POST/PUT/DELETE + filter params) | Backend |
| F23 | Categories API | Backend |
| F24 | Types API | Backend |
| F25 | Details API | Backend |
| F26 | DateReserve API (index + [id]) | Backend |
| F27 | Login API | Backend |
| F28 | Aggregate property endpoint (single fetch) | Backend |
| F29 | Server-side search & pagination | Backend |
| F30 | Auth on mutating API routes | Backend |
| F31 | Env-driven configuration (API/SITE/CONTACT URLs) | Cross-cutting |
| F32 | CORS policy | Cross-cutting |
| F33 | Live production deployment | Cross-cutting |
| F34 | Automated test suite | Cross-cutting |
| F35 | Lint-clean gate (0 errors) | Cross-cutting |
| F36 | TypeScript / shared API models | Cross-cutting |
| F37 | Data model quality (prix/lat/lon types, indexes) | Cross-cutting |
| F38 | Single PrismaClient reuse | Cross-cutting |
| F39 | Dead code & duplicate component cleanup | Cross-cutting |
| F40 | Secret management (JWT fallback secret) | Cross-cutting |

## 4. Feature Status

| ID | Status | Priority | Evidence |
|----|--------|----------|----------|
| F01 | **Partial** | P0 | Pages + fetch working locally (Sprint 1 replaced hardcoded origins; Sprint 1.1 regression 200s). Dead in production: `PRODUCT_FLOW.md` "home popular fetch dead host"; no live backend. |
| F02 | **Partial** | P0 | Client-side filter only. `PropertyList.jsx:18` `filteredProperties` state, slicing at `:150`; server params exist (`src/app/api/posts/route.tsx:177-183`) but no server-side pagination. Duplicate filter components (`fillter`/`filter`) per `PUBLIC_APP_AUDIT.md`. |
| F03 | **Partial** | P1 | Detail pages return data locally (Sprint 1.1 regression). Requires 2 requests per item (no aggregate endpoint, F28). YouTube/map/WhatsApp wiring per `PRODUCT_FLOW.md`. |
| F04 | **Partial** | P2 | Now env-driven via `SITE_BASE_URL` (Sprint 1 fix); still resolves to `http://localhost:3000` in dev and no production URL exists (F33) → broken share links in production (`PRODUCT_FLOW.md`). |
| F05 | **Working** | P2 | Both forms render, validate, and are guarded: `ContactForm.jsx:37` no-ops when `NEXT_PUBLIC_CONTACT_API_URL` unset; `contact.jsx:14` imports `CONTACT_API_URL`. |
| F06 | **Missing** | P0 | Delivery never works: `NEXT_PUBLIC_CONTACT_API_URL=""` (`env.example:42`) → `alert("Échec...")` (`ContactForm.jsx:38`); external `/Email` on `sendmailimmocean.onrender.com` is a 404 (`PRODUCT_FLOW.md`); no server-side lead store. |
| F07 | **Missing** | P1 | Empty stubs: `src/pages/gallery/index.jsx` (26 lines), `src/pages/gallery/[id].jsx` (27 lines); `PUBLIC_APP_AUDIT.md` "gallery stub". |
| F08 | **Missing** | P2 | `src/app/api/partennaire/` routes exist but no UI references (`grep` over `src/pages` + `src/components` = 0 hits); no partner logos on site. |
| F09 | **Partial** | P2 | Hardcoded mixed FR/EN copy; no i18n mechanism or toggle (grep for locale/i18n/toggle found only French prose in `cta.jsx`, `aboutt.jsx`). `PRODUCT_OVERVIEW.md` notes bilingual UI as a strength of the static copy only. |
| F10 | **Working** | P0 | Verified end-to-end (Sprint 1.1): valid login 200 + HS256 JWT, cookie `token` path `/` secure sameSite strict. |
| F11 | **Working** | P0 | Verified (Sprint 1.1): repeated requests with stored cookie stay authenticated (200). |
| F12 | **Working** | P0 | Verified (Sprint 1.1): no token → 307 → `/login`; valid token → 200. |
| F13 | **Missing** | P0 | Middleware is presence-only: malformed/expired tokens accepted (Sprint 1.1 empirical test → 200; `src/middleware.ts` no signature/expiry verification). Documented security issue in `SPRINT_1_1_AUTH_CHECKPOINT.md`. |
| F14 | **Working** | P1 | Verified (Sprint 1.1): js-cookie 3.0.5 `Cookies.remove('token')`, path `/` matches login cookie. |
| F15 | **Working** | P0 | All CRUD pages env-driven (Sprint 1); full create→read→update→delete cycle verified against temp listing id=9 (`SPRINT_1_LOCAL_INTEGRATION.md`). |
| F16 | **Working** | P2 | `SearchPost.jsx` passes params to posts API (`search` etc.) which supports them (`route.tsx:177-183`); verified locally. |
| F17 | **Working** | P1 | Cloudinary upload exercised during Sprint 1 CRUD verification; config present in dashboard. |
| F18 | **Missing** | P2 | API exists (F23/F24) but no management pages in `src/app/dashboard/` (grep shows categories/types only used as dropdown reads inside CRUD forms). |
| F19 | **Partial** | P1 | UI exists (`orders/page.jsx`, `OrderDialog.jsx`, `updateorder/[id]`) and renders client-side, but is unpersisted (`PRODUCT_FLOW.md` "orders client-rendered unpersisted"). |
| F20 | **Missing** | P1 | No `Order`/`Reservation` model in `prisma/schema.prisma` (grep); no server route; `showorder/[id]/page.jsx` is a 5-line empty stub. |
| F21 | **Partial** | P2 | Dynamic map present in insert/update forms; address→coords geocoding depends on valid OpenCage key from env; no offline fallback (`DASHBOARD_AUDIT.md`). |
| F22 | **Working** | P0 | CRUD + filter params verified (Sprint 1 + Sprint 1.1 regression). No auth on mutating methods (see F30). |
| F23 | **Working** | P2 | `src/app/api/categories/` index + `[id]` (GET/POST/PUT/DELETE) verified present; exercised by dashboard reads. |
| F24 | **Working** | P2 | `src/app/api/types/` index + `[id]` present; same as F23. |
| F25 | **Working** | P1 | `src/app/api/details/` + `postsdetails`/`postsDtails` routes return data; consumed by detail pages (Sprint 1.1 regression). |
| F26 | **Working** | P2 | `DateReserve/route.tsx` GET/POST; `DateReserve/[id]/route.tsx` GET/PUT/DELETE (supersedes `PRODUCT_FLOW.md` "index-only"). Dashboard consumption inconsistent (F19). |
| F27 | **Working** | P0 | Verified (Sprint 1.1): 200 valid creds + JWT; 401 invalid, identical message (no enumeration). |
| F28 | **Missing** | P2 | No `/api/properties` aggregate route (ls). Detail pages require 2 network requests per item (`PRODUCT_FLOW.md`). |
| F29 | **Missing** | P1 | No `page`/`limit` params on posts API (`route.tsx:177-183`); pagination is client-side only (`PropertyList.jsx:31`). |
| F30 | **Missing** | P0 | No `jwt.verify` in `src/app/api/posts/route.tsx` or `posts/[id]` (grep); unauthenticated POST/PUT/DELETE allowed on all CRUD routes (`PORTFOLIO_READINESS.md`). |
| F31 | **Working** | P0 | Sprint 1: `src/config/api.js` (public) + `src/lib/api.ts` (dashboard) resolve `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_SITE_URL`; `.env`/`env.example` populated; 0 hardcoded origins remain in `src/`. |
| F32 | **Partial** | P0 | Sprint 1: single `src/middleware.ts` allow-list 3000/3001, preflight 200, evil origin rejected. Production domain not in allow-list; never `*` + credentials. |
| F33 | **Missing** | P0 | `realestat.vercel.app` and `sendmailimmocean.onrender.com` dead (`PRODUCT_FLOW.md`, `PORTFOLIO_READINESS.md`). |
| F34 | **Missing** | P0 | No test files in either repo (glob/grep = 0); audits confirm "no tests". |
| F35 | **Missing** | P1 | Public 25 pre-existing lint errors; dashboard 22 (`PUBLIC_APP_AUDIT.md`, `DASHBOARD_AUDIT.md`; re-confirmed Sprint 1.1: 0 new). |
| F36 | **Partial** | P2 | Public app is Pages-Router JSX with untyped fetches; dashboard typed but with `any`-heavy payloads; no shared API model package (`DASHBOARD_AUDIT.md`). |
| F37 | **Missing** | P1 | `prix`, `lat`, `lon` stored as strings; no indexes (`PRODUCT_OVERVIEW.md`, `PORTFOLIO_READINESS.md`); no schema migration strategy in repo. |
| F38 | **Missing** | P2 | Per-request `new PrismaClient()` in route files (`INTEGRATION_AUDIT.md`, `PORTFOLIO_READINESS.md`). |
| F39 | **Missing** | P1 | Dead `src/server.js`, `next.config.mjs`, commented-out route handlers, duplicate `fillter`/`filter`, `postsdetails`/`postsDtails` (`PUBLIC_APP_AUDIT.md`). |
| F40 | **Missing** | P0 | Hardcoded JWT fallback secret in login route (`PORTFOLIO_READINESS.md`). `.env` files are gitignored (good) but live secrets are unmanaged. |

**Totals:** Working **15** (F05, F10–F12, F14–F17, F22–F27, F31) · Partial **9** (F01–F04, F09, F19, F21, F32, F36) ·
Missing **16** (F06–F08, F13, F18, F20, F28–F30, F33–F35, F37–F40) · Unknown **0**.
Priorities: P0 **16** · P1 **11** · P2 **13**.

## 5. Priority (P0 / P1 / P2)

**P0 — MVP / security / live deployment (must ship for MVP)**
F01, F02, F06, F10, F11, F12, F13, F15, F22, F27, F30, F31, F32, F33, F34, F40

**P1 — Core experience / integrity (next after MVP)**
F03, F07, F14, F17, F19, F20, F25, F29, F35, F37, F39

**P2 — Completeness / polish (after P0 + P1)**
F04, F05, F08, F09, F16, F18, F21, F23, F24, F26, F28, F36, F38

## 6. Dependencies

| Dependency | Blocks | Notes |
|------------|--------|-------|
| Hosting account (e.g., Render for API/apps, Vercel for statics) | F33, F01, F02, F06 | Current providers dead; needs replacement or re-activation. |
| Managed PostgreSQL (or existing DB URI) | F33, F20 | Required for live data + new `Order` model. |
| Managed JWT secret (env, not fallback) | F13, F30, F40 | Shared by public API + dashboard middleware. |
| Email/SMTP provider or lead table + dashboard view | F06 | Choose: transactional email vs. DB-persisted leads. |
| Valid OpenCage API key | F21 | Client-visible key must be constrained/rotated. |
| Cloudinary account/key | F17, F33 | Already configured; keep in prod env. |
| Prisma migration for `Order` model | F20 | New model + migration; keep `prix` string migration (F37) in same pass. |
| Production CORS allow-list values | F32 | Domain of deployed dashboard. |
| Test runner choice (Jest/Vitest/Playwright) | F34 | None exists in either repo today. |

## 7. Acceptance Criteria

**Cross-cutting (P0)**
- AC-1: Both apps reachable at production URLs with HTTPS; all P0 features pass end-to-end against the live backend.
- AC-2: Every mutating endpoint (`POST/PUT/DELETE` on posts, categories, types, details, DateReserve) returns `401` without a valid, unexpired JWT; a tampered/expired token is rejected.
- AC-3: No JWT secret is hardcoded; secrets live in env with rotation documented.
- AC-4: CORS allow-list includes the production dashboard origin; preflight passes; evil origins get no CORS headers.
- AC-5: At least one automated test suite (API + login + routing) passes in CI; `npm run test` green in both repos.

**Feature-level (P0/P1)**
- AC-6 (F06): A submitted contact form either emails staff or persists a lead row visible in the dashboard; no "failure" alert under normal operation; stored payloads include name/email/phone/message + listing ref.
- AC-7 (F02/F29): Search/filter/pagination run server-side; results pages are deterministic (page/limit honored); client filter code and duplicate `fillter` component removed.
- AC-8 (F03/F28): A single aggregate property endpoint returns the full card+detail payload; detail modal renders from one request.
- AC-9 (F07): Gallery pages render real imagery (from Cloudinary) with empty/error states.
- AC-10 (F19/F20): Orders can be created, listed, updated, and deleted; they persist in the DB and survive refresh.
- AC-11 (F13): Dashboard middleware rejects tokens with invalid signature or expired `exp`.
- AC-12 (F37/F38): `prix`/`lat`/`lon` are correctly typed (e.g., `Decimal`/`Float`); key query columns indexed; PrismaClient is a single shared instance.
- AC-13 (F35/F39): Both repos reach 0 lint errors; all dead files (`src/server.js`, `next.config.mjs`) and duplicated components removed.

## 8. Milestones

**M1 — Restore the live platform (Foundation)** — closes the "production-dead" gap.
Redeploy/relocate backend + DB (F33), configure production env + secrets (F40, F31), CORS for prod domain (F32),
minimal smoke test suite (F34), dead-code removal (F39). *Exit: public site + dashboard reachable live; local
verification suite exists.*

**M2 — Secure the platform (Security)** — closes known security gaps.
JWT signature/expiry validation (F13), auth on all mutating routes (F30), lead delivery + storage (F06),
single PrismaClient (F38). *Exit: all mutating endpoints 401 without valid token; contacts persist.*

**M3 — Complete core features (Feature completeness)** — finishes the advertised product.
Server-side search/pagination (F29), aggregate property endpoint (F28), orders persistence + API (F20) and
orders UI (F19), gallery (F07), category/type management UI (F18), data model cleanup (F37). *Exit: MVP feature
set complete and verified end-to-end.*

**M4 — Engineering hardening (Quality)** — makes the codebase maintainable.
Lint-clean gate (F35), TypeScript/shared API models (F36), i18n (F09), partners section (F08), geocoding
hardening (F21), WhatsApp/production URLs (F04), full test coverage (F34). *Exit: 0 lint errors, full test
suite green, no known P2 gaps.*

## 9. Estimated Implementation Order

Ordered by priority then dependency. Rough effort tags are T-shirt sizes (relative to a full-stack dev).

1. **F33** live deployment (L) — prerequisite for everything production-facing. *(also unlocks F01/F02)*
2. **F31 → F40 → F32** config, secrets, CORS for prod (M, S, M) — must precede any live feature.
3. **F27 → F10 → F11 → F12** login flow re-verification on live stack (M).
4. **F13 + F30** JWT validation + route auth (M, L) — security-critical, before opening CRUD to the public.
5. **F22 → F15 → F17** listings CRUD + uploads re-verified live (M, M, S).
6. **F06** lead delivery/storage (L) — completes the public funnel.
7. **F01 → F02 → F29** browsing + server-side search/pagination (S, M, L).
8. **F03 → F28** detail view via aggregate endpoint (M, S).
9. **F19 → F20** orders UI + persistence (S, L) — needs new Prisma model + migration.
10. **F07** gallery (S) · **F18** category/type management UI (M).
11. **F37 + F38** data model types/indexes + single PrismaClient (M, S) — best done with the F20 migration.
12. **F35** lint-clean pass (M) · **F34** test suite build-out (L) — ongoing from M2 onward.
13. **F39** dead-code/duplicate cleanup (S) · **F36** shared models/TS (L).
14. **F04, F05, F08, F09, F16, F21, F23, F24, F25, F26, F28** polish (S/M each) — remaining P2 items.
