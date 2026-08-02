# Target Architecture — Destination Structure in `dashbord-realstat`

## 1. Target directory layout

The dashboard repo gains an App-Router backend. Database logic is isolated in `src/lib/`;
route handlers contain only request/response + service orchestration.

```
dashbord-realstat/
├── prisma/                              # NEW (copied from realestat, unchanged)
│   ├── schema.prisma
│   └── migrations/                      # exact copy incl. migration_lock.toml
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── login/route.ts           # MOVED (was route.jsx → converted to TS)
│   │   │   ├── categories/route.ts
│   │   │   ├── categories/[id]/route.ts
│   │   │   ├── types/route.ts
│   │   │   ├── types/[id]/route.ts
│   │   │   ├── posts/route.ts
│   │   │   ├── posts/[id]/route.ts
│   │   │   ├── postsDetails/[id]/route.ts   # exact casing preserved
│   │   │   ├── details/route.ts
│   │   │   ├── details/[id]/route.ts
│   │   │   ├── DateReserve/route.ts
│   │   │   ├── DateReserve/[id]/route.ts
│   │   │   ├── partennaire/route.ts
│   │   │   ├── partennaire/[id]/route.ts
│   │   │   └── user/route.ts
│   │   └── ... (existing dashboard pages unchanged)
│   ├── lib/
│   │   ├── api.ts                        # KEEP (client base-URL config)
│   │   ├── prisma.ts                     # NEW shared Prisma client singleton
│   │   ├── auth.ts                       # NEW JWT sign/verify helpers
│   │   ├── cloudinary.ts                 # NEW single Cloudinary config + upload/destroy + publicIdFromUrl
│   │   ├── cors.ts                       # NEW origin allow-list + header builder
│   │   └── validation.ts                 # NEW field/enum validators (replaces inline checks)
│   └── middleware.ts                     # MERGE: existing auth-cookie guard + new CORS layer
```

No database logic inside components. Route handlers import from `src/lib/*` only.

## 2. Exact source → destination mapping

| Current file (`realestat`) | Destination (`dashbord-realstat`) | Notes |
|---|---|---|
| `prisma/schema.prisma` | `prisma/schema.prisma` | byte-identical; provider/generator unchanged |
| `prisma/migrations/*` | `prisma/migrations/*` | exact copy incl. `migration_lock.toml`; never re-created |
| `src/app/api/categories/route.tsx` | `src/app/api/categories/route.ts` | Prisma calls → `src/lib/prisma.ts` |
| `src/app/api/categories/[id]/route.tsx` | `src/app/api/categories/[id]/route.ts` | id via `{ params }`, not `url.split('/')` |
| `src/app/api/types/route.tsx` | `src/app/api/types/route.ts` | same |
| `src/app/api/types/[id]/route.tsx` | `src/app/api/types/[id]/route.ts` | same |
| `src/app/api/posts/route.tsx` | `src/app/api/posts/route.ts` | Cloudinary → `src/lib/cloudinary.ts`; strip PII (`DateReserve` omit) + `console.log("dw")`; keep GET auto-status logic intact |
| `src/app/api/posts/[id]/route.tsx` | `src/app/api/posts/[id]/route.ts` | Cloudinary + `publicIdFromUrl` → lib |
| `src/app/api/postsDetails/[id]/route.tsx` | `src/app/api/postsDetails/[id]/route.ts` | keep exact casing; dedupe shared logic into libs |
| `src/app/api/details/route.tsx` | `src/app/api/details/route.ts` | parse `postId` before connect |
| `src/app/api/details/[id]/route.tsx` | `src/app/api/details/[id]/route.ts` | guard undefined `postId` |
| `src/app/api/DateReserve/route.tsx` | `src/app/api/DateReserve/route.ts` | keep auto-status side-effect + `reservedDates` expansion; guard `price` NaN |
| `src/app/api/DateReserve/[id]/route.tsx` | `src/app/api/DateReserve/[id]/route.ts` | unchanged logic |
| `src/app/api/partennaire/route.tsx` | `src/app/api/partennaire/route.ts` | candidate DELETE AFTER CUTOVER |
| `src/app/api/partennaire/[id]/route.tsx` | `src/app/api/partennaire/[id]/route.ts` | same |
| `src/app/api/user/route.tsx` | `src/app/api/user/route.ts` | strip password hash from response if kept |
| `src/app/api/login/route.jsx` | `src/app/api/login/route.ts` | `JWT_SECRET` from env only (no hardcoded fallback); `src/lib/auth.ts` |
| `src/middleware.ts` | merge into `src/middleware.ts` | CORS layer (copied) + existing `/dashboard` auth guard; single matcher |
| — | `src/lib/prisma.ts` | NEW: `global` singleton, `PrismaClient` |
| — | `src/lib/auth.ts` | NEW: `signToken(userId)`, `verifyToken(token)` |
| — | `src/lib/cloudinary.ts` | NEW: config once, `uploadImages()`, `destroyImage(publicId)`, `publicIdFromUrl()` |
| — | `src/lib/cors.ts` | NEW: `allowedOrigins`, `corsHeaders(origin)` |
| — | `src/lib/validation.ts` | NEW: `requireFields()`, `assertEnum(value, enum)` |
| — | `prisma/migrations/` | copied only |

**Not moved (stays in `realestat`):** `src/pages/**` (public frontend), public
components, `next.config.js` (redirects/images), public `src/config/api.js`,
`src/lib/get-site-url.ts` (public), contact form components, `next-env.d.ts`, UI assets.

## 3. Prisma client singleton (Phase 1)

```ts
// dashbord-realstat/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Replaces the 15 module-level instances. Prevents connection exhaustion in serverless.

## 4. Middleware (merged, single layer)

- Matcher: `/api/:path*` (CORS + optional token check for mutation routes) and
  `/dashboard*` (existing auth redirect).
- CORS: copy the realestat allow-list (`localhost:3000`, `localhost:3001`,
  `dashbord-realstat-chi.vercel.app`, `realestat-eight.vercel.app`) then replace with
  the production domains (dashboard/backend origin + public site origin) per phase.
- Auth: keep cookie-presence guard for `/dashboard*`; optionally enforce token
  verification on mutation routes after Phase 5 (out of scope for the move itself).
- Add `Vary: Origin` on CORS responses.
- Remove the dead per-route `OPTIONS` handlers / `setCorsHeaders` no-ops.

## 5. Route-handler conventions in the destination

- TypeScript for all moved routes (the lone `.jsx` login route is converted).
- id extraction: use `{ params }` (`export async function PUT(req, { params })`), never
  `url.split('/')`.
- All `new PrismaClient()` → `import { prisma } from '@/lib/prisma'`.
- All Cloudinary config/upload/destroy → `@/lib/cloudinary`.
- All `JWT_SECRET` reads → `@/lib/auth`.
- All CORS → middleware only; no route-level headers.
- Preserve exact response shapes and HTTP statuses from ROUTE_INVENTORY.md §1.

## 6. Dashboard client config after cutover

- `src/lib/api.ts` stays the single client base-URL source.
- After Phase 6 the dashboard sets `NEXT_PUBLIC_API_URL` to its **own origin**
  (same-origin API; e.g. `http://localhost:3001` locally). The public app sets
  `NEXT_PUBLIC_API_URL` to the dashboard/backend origin.
- `src/contexts/post.jsx` and all page-level fetchers already use `${API_BASE_URL}`,
  so only the env value changes — no consumer code edits required for the switch.
