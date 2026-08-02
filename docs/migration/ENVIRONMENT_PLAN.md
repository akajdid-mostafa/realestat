# Environment Variable Plan

Variable **names only** — no values. Classified per repo, per target, with runtime
visibility and whether the public repo must drop them after cutover.

## 1. Inventory of every variable used today

| Variable | Current repo | Target repo | Visibility | Required locally | Required in production | Remove from public after cutover |
|---|---|---|---|---|---|---|
| `POSTGRES_PRISMA_URL` | realestat | dashbord-realstat | server-only (Prisma datasource) | yes (for API) | yes | **yes** |
| `POSTGRES_URL_NON_POOLING` | realestat | dashbord-realstat | server-only (Prisma `directUrl`, used by `prisma migrate`) | yes (migrations) | yes | **yes** |
| `JWT_SECRET` | realestat | dashbord-realstat | server-only | yes (login) | yes | **yes** |
| `CLOUD_NAME` | realestat | dashbord-realstat | server-only | yes (image uploads) | yes | **yes** |
| `CLOUDINARY_API_KEY` | realestat | dashbord-realstat | server-only | yes | yes | **yes** |
| `CLOUDINARY_API_SECRET` | realestat | dashbord-realstat | server-only | yes | yes | **yes** |
| `NODE_ENV` | realestat | both | server-only | no (Next sets it) | no | no |
| `NEXT_PUBLIC_API_URL` | both (3000 / 3000) | both (dashboard=own origin; public=dashboard origin) | NEXT_PUBLIC (client) | yes | yes | **yes for realestat after cutover — value changes to the new origin** |
| `NEXT_PUBLIC_SITE_URL` | realestat (public share links) | realestat (unchanged); dashboard also uses it | NEXT_PUBLIC (client) | yes | yes | no |
| `NEXT_PUBLIC_CONTACT_API_URL` | realestat (external contact API, complete endpoint) | realestat (unchanged) | NEXT_PUBLIC (client) | optional (empty → forms fail honestly) | yes | no |
| `NEXT_PUBLIC_OPENCAGE_API_KEY` | dashbord-realstat (map geocoding) | dashbord-realstat (unchanged) | NEXT_PUBLIC (client) | optional (graceful degrade) | yes | n/a (not in public) |
| `NEXT_PUBLIC_LOG_LEVEL` | dashbord-realstat | dashbord-realstat (unchanged) | NEXT_PUBLIC (client) | no | no | n/a |
| `NEXT_PUBLIC_VERCEL_URL` | dashbord-realstat (Vercel-provided fallback) | dashbord-realstat (unchanged) | NEXT_PUBLIC (client) | no | auto | n/a |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | realestat `env.example` only (commented) | n/a | NEXT_PUBLIC | no | no | optional cleanup |

## 2. Grouped classification

### Dashboard / backend (after move)
- **DATABASE / Prisma:** `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
- **JWT:** `JWT_SECRET`
- **Cloudinary:** `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **CORS:** none as env — allow-list is code in `src/lib/cors.ts` (must be redeployed with
  the dashboard; do **not** put it in a `NEXT_PUBLIC_*` variable)
- **OpenCage:** `NEXT_PUBLIC_OPENCAGE_API_KEY` (already dashboard-owned; stays)
- **Site/API URLs:** `NEXT_PUBLIC_API_URL` (becomes the dashboard's own origin after
  cutover), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_LOG_LEVEL`, `NEXT_PUBLIC_VERCEL_URL`

### Public frontend
- **Public API URL:** `NEXT_PUBLIC_API_URL` (re-pointed to the dashboard/backend origin)
- **Public site URL:** `NEXT_PUBLIC_SITE_URL` (unchanged — WhatsApp share links)
- **External contact API URL:** `NEXT_PUBLIC_CONTACT_API_URL` (unchanged)

## 3. Per-phase env wiring (names only; exact steps in MIGRATION_PHASES.md)

- **Phase 1:** add the 6 server-only vars to `dashbord-realstat/.env`
  (`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`, `CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) — same database as today, no new DB.
- **Phase 2–4:** dashboard route tests run on `:3001` using those server vars; the
  dashboard's `NEXT_PUBLIC_API_URL` stays `http://localhost:3000` until Phase 6.
- **Phase 5:** login moves; `JWT_SECRET` consumed only by the dashboard backend.
- **Phase 6:** dashboard `NEXT_PUBLIC_API_URL` → `http://localhost:3001` (own origin);
  public `NEXT_PUBLIC_API_URL` → `http://localhost:3001`.
- **Phase 7:** delete the 6 server-only vars from `realestat/.env` (and their public
  `env.example` sections: `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`,
  `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- **Phase 8:** production — server-only vars in the dashboard/backend host; public host
  keeps only the three `NEXT_PUBLIC_*` vars; CORS allow-list in code updated to prod
  origins.

## 4. Rules

- Never commit `.env` or `.env.local` (gitignored in both repos).
- Server-only vars must **never** be prefixed `NEXT_PUBLIC_` (they would ship to the
  browser and leak the database/Cloudinary/JWT secrets).
- `NEXT_PUBLIC_API_URL` is the only variable that flips meaning between repos at cutover;
  every dashboard consumer already reads it via `src/lib/api.ts`, and every public
  consumer via `src/config/api.js`, so no source edits are needed for the switch.
- The public repo's `env.example` is updated in Phase 7 to drop the 6 backend vars.
