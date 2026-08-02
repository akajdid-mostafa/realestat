# Environment Secret Rotation

Phase 8. No secret values are recorded in this document — variable names and
status only.

## 1. Env files present in git history

### Public `realestat` (origin: `github.com/akajdid-mostafa/realestat`)

`.env` exists in **24 historical commits** on `master`. Secret-bearing content
(8–11 secret-var lines) is present in the 2024-08 → 2024-09-27 commits
(`a4fc038` … `946c4a1`). The final committed `.env` (`c2f62b8`, 2025-11-17)
already contains **zero** secret lines (scrubbed), but earlier commits still
hold real values.

- **Index state now:** `.env` is **untracked** (`git ls-files .env` empty),
  present on disk, and covered by `.gitignore` (`.env`, `.env.local`,
  `.env.*.local`, `.env.backup`, `.env.bak`, `.env.bak2`). No `.env` is staged
  or committed in any Phase 7/8 commit.
- **Requires rotation:** the values in the 2024 history are still in the shared
  branch history.

### Dashboard `dashbord-realstat` (origin: `github.com/akajdid-mostafa/dashbord-realstat`)

`.env` appears in the initial commit `66bff16` (2025-11-18) and was removed from
tracking in `c3cb11e` ("Remove .env from tracking and update .gitignore for
sensitive files", 2025-11-18).

- **Index state now:** untracked, on disk, `.gitignore` covered (`.env`,
  `.env.local`, `.env.*.local`, plus per-environment variants).
- **Requires rotation:** the initial-commit value is in branch history.

## 2. Affected secret categories

| Category | Vars | History exposure |
| --- | --- | --- |
| PostgreSQL (Neon) credentials | `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` | public 2024 history |
| JWT signing secret | `JWT_SECRET` | public 2024 history |
| Cloudinary API credentials | `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | public 2024 history |
| OpenCage geocoding key | `NEXT_PUBLIC_OPENCAGE_API_KEY` | public 2024 history |
| Cloudinary cloud name | `CLOUD_NAME` | non-secret (retained as-is) |

## 3. Rotation status

| Credential | Provider | Rotation method | Status |
| --- | --- | --- | --- |
| PostgreSQL password | Neon (dashboard) | Neon dashboard/API — create new role/password, update `POSTGRES_PRISMA_URL` + `POSTGRES_URL_NON_POOLING`, revoke old | **PENDING — user action** |
| `JWT_SECRET` | self-managed | Generate new value (e.g. `openssl rand -hex 32`), set in dashboard Vercel project + local `.env`, invalidate old | **PENDING — new value must be set** |
| Cloudinary API key/secret | Cloudinary | Cloudinary dashboard → settings → rotate API key & secret; update dashboard Vercel project + local `.env` | **PENDING — user action** |
| OpenCage key | OpenCage | OpenCage dashboard → generate new key; update dashboard Vercel project + local `.env`; revoke old | **PENDING — user action** |

No credential was rotated automatically by the agent (provider dashboards/API
access required). Until every row above is complete and verified the app still
uses only new values, Phase 8 remains **BLOCKED** — do not claim production
readiness.

## 4. Vercel update status

| Project | Env update | Status |
| --- | --- | --- |
| Dashboard Vercel project | set 6 server-only vars + `NEXT_PUBLIC_API_URL`/`SITE_URL`/`OPENCAGE`/`LOG_LEVEL` to rotated values | **PENDING — requires access to the production Vercel account** |
| Public Vercel project | ensure only `NEXT_PUBLIC_API_URL`/`SITE_URL`/`CONTACT_API_URL`; remove any stale backend vars | **PENDING — requires access to the production Vercel account** |

## 5. Rules applied

- No `.env`/`.env.local` value is printed, committed, or staged.
- `.gitignore` in both repos now explicitly covers `.env`, `.env.local`,
  `.env.*.local`.
- Server-only vars are never `NEXT_PUBLIC_`-prefixed.
- Rotation is the mitigation for secrets already in history; git history is not
  rewritten in this phase.
