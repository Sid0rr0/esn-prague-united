# ESN Prague

Monorepo for the ESN Prague website: Sanity Studio (content) + Astro (site), hosted on Vercel (setup: [`apps/web/VERCEL-SETUP.md`](apps/web/VERCEL-SETUP.md)).

## Apps

- [`apps/studio`](apps/studio) — Sanity Studio, editorial content schemas. See its [README](apps/studio/README.md).
- [`apps/web`](apps/web) — Astro site that reads content via the GROQ queries in [`apps/web/src/lib/queries.ts`](apps/web/src/lib/queries.ts).

## Setup

```bash
pnpm install
pnpm dev:studio   # http://localhost:3333
pnpm dev:web      # http://localhost:4321
```

## Scripts (run from repo root)

| Script                              | Description              |
| ----------------------------------- | ------------------------ |
| `pnpm lint` / `pnpm lint:fix`       | ESLint across all apps   |
| `pnpm format` / `pnpm format:check` | Prettier across all apps |
| `pnpm typecheck`                    | Type-check all apps      |
| `pnpm build`                        | Build all apps           |

Husky runs `lint-staged` (ESLint + Prettier) on staged files before each commit.

## Docs

Domain terminology and content model: [`CONTEXT.md`](CONTEXT.md), [`docs/adr/`](docs/adr).
