# Phase 1 Foundation — Dashboard Backend Foundation

Date: 2026-08-02
Scope: `dashbord-realstat` is prepared to own the backend. No API route moved,
no consumer origin changed, no data/schema/migration change, nothing pushed.

## 1. Initial commit hashes and git state

| Repo | Branch | HEAD (before) | State |
| --- | --- | --- | --- |
| `realestat` | `master` | `9d5f660cb0494edf545d9d2c287f9affee92c725` ("chore: establish backend migration baseline") | clean |
| `dashbord-realstat` | `main` | `eae70cb968ecc8e936778beee442122a864fa924` ("fix: make reservations portfolio ready") | clean |

Both trees were clean before editing. `.env` / `.env.local` are gitignored in
both repos. Phase 0 database backup verified still available (external logical
dump + Neon provider-managed backups).

## 2. Package / version changes (dashboard only)

Installed via `npm install` (lockfile only — no hand edits):

| Package | From | To | Type |
| --- | --- | --- | --- |
| `next` | 14.2.4 | **14.2.12** | dependency (aligned to public installed) |
| `@prisma/client` | — | **5.22.0** | dependency |
| `prisma` | — | **5.22.0** | devDependency |
| `cloudinary` | — | 2.4.0 | dependency (matches public) |
| `jsonwebtoken` | — | 9.0.2 | dependency (matches public) |
| `@types/jsonwebtoken` | — | 9.0.6 | devDependency (matches public) |

Script added: `"postinstall": "prisma generate"`.

Verified: `npx prisma --version` → `prisma 5.22.0`; `@prisma/client` 5.22.0.
No Next 15, no Prisma 7, no broad upgrades. Public `package.json` untouched.

## 3. Prisma copy / checksum result

Copied (not recreated) from `realestat/prisma` to `dashbord-realstat/prisma`:
`schema.prisma`, `migrations/migration_lock.toml`, and the 4 migrations
(`20240923153248_remove_date_post`, `20240927085732_init`,
`20241002101418_update_rooms_bedromms_bathrooms_to_int`,
`20241004081013_modify_type_name_schema`).

Verification: `diff -r realestat/prisma dashbord-realstat/prisma` → IDENTICAL;
SHA-256 per file → all **OK**. Schema not edited; no migration created; no
`prisma migrate dev` / `reset` run.

## 4. Shared libraries created (dashboard)

| File | Contents |
| --- | --- |
| `src/lib/prisma.ts` | Production-safe singleton; `globalThis` reuse in dev; log `['warn','error']` dev / `['error']` prod; exports `prisma`. |
| `src/lib/auth.ts` | `signToken(userId)` / `verifyToken(token)`; `JWT_SECRET` from env only (throws if missing, no hardcoded fallback); preserves existing `1h` expiry and `{ userId }` payload. |
| `src/lib/cloudinary.ts` | Single `cloudinary.config` from server env; `uploadImage`, `uploadImages`, `destroyImage`, `publicIdFromUrl` (exact regex incl. folder, `secure_url`); folder `realstat`. No real upload/delete invoked in this phase. |
| `src/lib/cors.ts` | `allowedOrigins` = `http://localhost:3000`, `http://localhost:3001`; `isAllowedOrigin`; `corsHeaders` echoes only an allowed origin + `Vary: Origin` + methods `GET,POST,PUT,DELETE,OPTIONS` + headers `Content-Type, Authorization`; no `*` with credentials. |
| `src/lib/validation.ts` | `missingRequiredFields`, `parseNumericId`, `isValidEnum`, `parseJsonBody`, `parseJsonField`. |

Not wired into any route (no `src/app/api` exists in the dashboard yet).

## 5. Environment variable names added

Added to `dashbord-realstat/env.example` (names only, existing vars kept):
`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`,
`CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Values were added only to the gitignored dashboard `.env` (copied from the
public `.env`, never printed, never committed). None are `NEXT_PUBLIC_`-prefixed.

## 6. Prisma generate / migrate-status result

- `npx prisma generate` → **Generated Prisma Client (v5.22.0)** to `./node_modules/@prisma/client`.
- `npx prisma migrate status` → **Database schema is up to date!** — 4 migrations
  found, datasource = same Neon `neondb` database used by the public app.

## 7. Read-only database counts (dashboard shared client)

Run via a temporary server-only script importing `src/lib/prisma` (deleted
afterwards; no writes, no PII printed):

| Model | Count | Phase 0 baseline | Match |
| --- | --- | --- | --- |
| Post | 9 | 9 | ✓ |
| Detail | 6 | 6 | ✓ |
| Category | 2 | 2 | ✓ |
| Type | 6 | 6 | ✓ |
| DateReserve | 0 | 0 | ✓ |
| User | 1 | 1 | ✓ |

No create/update/delete query was executed.

## 8. Dashboard typecheck / build / lint

- `npm run typecheck` (`tsc --noEmit`): **PASS** (exit 0).
- `npm run build`: **PASS** (exit 0).
- `npm run lint`: exit 1 — **18 errors / 6 warnings**, identical to the Phase 0
  pre-existing baseline; **no errors in the new `src/lib/*` files**.

## 9. Public build

- `realestat` `npm run build`: **PASS** (exit 0). No tracked file changed
  (`git status --short` empty) during Phase 1.

## 10. Confirmation — consumers still use port 3000

- Dashboard `.env` / `env.example`: `NEXT_PUBLIC_API_URL=http://localhost:3000` (unchanged).
- Dashboard `src/lib/api.ts`: unchanged (fallback `http://localhost:3000`).
- No `src/app/api/*` exists in the dashboard (no new route).
- No consumer source file changed (`src/contexts`, pages, components untouched).
- No `new PrismaClient()` outside `src/lib/prisma.ts`.
- No secret variable names present in dashboard `.next` build output.

## 11. Rollback steps

- Dashboard: revert/undo the foundation commit, or
  `git checkout HEAD -- prisma src/lib package.json package-lock.json env.example`
  (also drops the Next 14.2.4→14.2.12 pin and Prisma deps).
- Public: revert the docs commit.
- Database: untouched; Phase 0 backup + Neon PITR remain.

## 12. Final verdict

**READY FOR PHASE 2** — Prisma CLI/client both 5.22.0; schema and migrations
byte-identical; `prisma generate` passes; `migrate status` reports up to date
(4 migrations); read-only counts match baseline; dashboard typecheck/build
pass; public build passes; no API route moved; no consumer origin changed; no
data/schema/migration change; both trees clean after commits; no secrets
committed; no push.
