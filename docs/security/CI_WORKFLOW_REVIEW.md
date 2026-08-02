# CI Workflow Security Review

Date: 2026-08-02
Scope: `.github/workflows/ci.yml` (tracked at HEAD, deleted in working tree)
Review type: static inspection only (the workflow was never executed)

## 1. Verdict

**UNSAFE — malicious / secret-exfiltration workflow. Delete and do not re-run.**

The workflow is confirmed as a credential-harvesting / secret-exfiltration
payload. It is unrelated to building, testing, or deploying this project.

## 2. Files inspected

| File | Status |
| --- | --- |
| `.github/workflows/ci.yml` | Tracked (added in commit `a75b33d` "chore: sync ci configuration"); removed from the working tree; no `.github/` directory exists on disk. |
| Other `.github` files | None. `git ls-files | grep .github` returns only `ci.yml`. |

No similar workflow patterns exist in the dashboard repository
(`dashbord-realstat` has no `.github` directory).

## 3. Suspicious signals (static, structural)

- **Workflow name:** `SysDiag` — unrelated to build/test/release of this repo.
- **Triggers:** `on: push` for **all branches** plus `on: pull_request_target`.
  `pull_request_target` runs with the repository's secrets and permissions
  rather than the PR's, making it a common abuse vector.
- **Permissions block:** requests `contents: read`, `id-token: write`, and
  `actions: read`. `id-token: write` grants OIDC token access (can assume cloud
  IAM roles); `actions: read` is a token scope that has no legitimate use in a
  build-and-test workflow.
- **Main step:** a large opaque base64-encoded blob is piped to
  `base64 -d | bash`. The blob references an external host
  (`216.126.225.129:8443`) and identifiers such as `megalodon` / `gh_dump`,
  and the decoded content contains credential-harvesting markers
  (`printenv`, `/proc/*/environ`, AWS/gcloud/git/SSH credentials, CI tokens,
  EC2/GCP metadata endpoints, exfiltration HTTP functions).
  The base64 was decoded only once, inside the prior read-only architecture
  audit, to confirm the payload; no payload was executed in this review.
- **Exfil target:** an IP:port host outside GitHub Actions infrastructure,
  which is not a legitimate CI endpoint.

## 4. Decision and actions

- The workflow is **deleted** (the file is already absent from the working
  tree; the deletion is committed in this checkpoint).
- Nothing from this workflow was executed during the review (`git show` only).
- The workflow file should **never** be restored.

## 5. Remediation / replacement

Replace any CI needs with a minimal, standard workflow that:
- uses `on: push` / `on: pull_request` (never `pull_request_target`) to build
  branches/PRs;
- requests only the permissions it needs (typically `contents: read`);
- never pipes decoded content to a shell;
- pins actions to full-length commit SHAs (`actions/checkout@<sha>`) rather
  than mutable tags.
