# Phase 0 Checkpoint — Security Review & Migration Baseline

Date: 2026-08-02
Scope: pre-migration baseline, security review, database backup checkpoint.
Read-only guarantees: no API routes moved, no Prisma copied, no schema /
migration / data / behavior changes, no pushes.

## 1. Repository states

### Public API + frontend — `realestat`
- Branch: `master`; remote: `origin https://github.com/akajdid-mostafa/realestat.git`
- HEAD: `9bff4111d0900e5afd6ee81169bc7c5ff3944c02` ("docs: finalize orders readiness decision")
- Up to date with `origin/master`. Working tree clean (see §3 for committed items).
- No `.env` tracked.

### Dashboard — `dashbord-realstat`
- Branch: `main`; remote: `origin https://github.com/akajdid-mostafa/dashbord-realstat.git`
- HEAD: `eae70cb968ecc8e936778beee442122a864fa924` ("fix: make reservations portfolio ready")
- Up to date with `origin/main`. Working tree clean. No tracked changes after `npm ci` (no dashboard commit made).

## 2. Security review

- `.github/workflows/ci.yml` (tracked) reviewed statically and found to be a
  malicious secret-exfiltration workflow (`SysDiag`; `pull_request_target`;
  `id-token: write` + `actions: read`; base64 payload → external host
  `216.126.225.129:8443`). Never executed.
- Deleted and committed. Full report: `docs/security/CI_WORKFLOW_REVIEW.md`.
- No other `.github` workflows exist in either repo. No `.env` tracked in either repo.

## 3. Committed in this checkpoint

Commit: `chore: establish backend migration baseline` (public repo)

- `docs/migration/BACKEND_MIGRATION_OVERVIEW.md`
- `docs/migration/ROUTE_INVENTORY.md`
- `docs/migration/TARGET_ARCHITECTURE.md`
- `docs/migration/ENVIRONMENT_PLAN.md`
- `docs/migration/MIGRATION_PHASES.md`
- `docs/migration/RISK_AND_ROLLBACK.md`
- `docs/security/CI_WORKFLOW_REVIEW.md`
- Deletion of `.github/workflows/ci.yml`

## 4. Database backup checkpoint

- Provider: Neon (serverless Postgres). Neon provider-managed backups/PITR remain
  the operational fallback.
- Local logical backup (verified, read-only) taken this date:
  - Method: `pg` 8.13.1 + `pg-copy-streams` 6.0.5 in an external temp directory
    (outside both repositories); `COPY (SELECT ...) TO STDOUT (FORMAT csv, HEADER)`
    per public table via the non-pooling URL (URL never printed, not committed).
  - Location: system temp dir `/var/folders/.../opencode/pgbackup/dump/` (external to both repos).
  - Tables (8): `Category, DateReserve, Detail, Partennaire, Post, Type, User, _prisma_migrations`.
  - Verification: per-table row counts queried before and after each dump; all
    equal; CSV line counts match `rows + 1` (header). All `status=OK`.
  - Counts: Category 2, DateReserve 0, Detail 6, Partennaire 0, Post 9, Type 6,
    User 1, `_prisma_migrations` 4.
  - Readability spot-checked (headers + safe tables). Not restored to any environment.

## 5. Baseline validation

### Public — `realestat`
- `npm ci` clean (Node 22.17.0, npm 10.9.2).
- `npm run build`: PASS (all routes listed, no errors).
- `npm run lint`: exit 1 — **25 errors / 2 warnings**, all pre-existing in
  frontend components (none in `/api/**`). Not fixed in Phase 0.

### Dashboard — `dashbord-realstat`
- `npm ci` clean (1123 packages).
- `npm run typecheck` (`tsc --noEmit`): PASS (exit 0).
- `npm run build`: PASS (exit 0, all routes listed).
- `npm run lint`: exit 1 — **18 errors / 6 warnings**, pre-existing. Not fixed in Phase 0.

## 6. Smoke tests (read-only, no mutations)

| # | Test | Result |
| --- | --- | --- |
| 1 | `GET /api/posts` (public :3000) | 200, 9 posts |
| 2 | `GET /api/details` (public :3000) | 200 |
| 3 | `POST /api/login` invalid creds | 401 |
| 4 | `/dashboard/orders` without token (dashboard :3001) | 307 → `/login` |
| 5 | `/login` (dashboard :3001) | 200 |

No create/update/delete requests issued. Servers stopped after tests.

## 7. Rollback point

- Backend/DB state is untouched by this phase; the migration starts from the
  current schema (`4` recorded migrations) and data (see §4 counts).
- Code baseline: commit `9bff411` (public) / `eae70cb` (dashboard).
- Database: verified logical dump (external location) + Neon provider-managed backups.

## 8. Phase 1 approval

**READY FOR PHASE 1** — all Phase 0 acceptance items met:
migration docs committed; malicious CI workflow reviewed, removed, and committed;
both builds pass; dashboard typecheck passes; lint baselines recorded; backup
verified readable; both trees clean; nothing pushed; no data or schema changes.
