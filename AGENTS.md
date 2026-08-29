# StillBuilding

Personal productivity & deep-work companion app (task management, pomodoro timer, blocker logging).

## Monorepo

- **Package manager**: pnpm (workspaces + Turborepo)
- **Workspaces**: `apps/api` (Express.js), `apps/mobile` (React Native Expo), `packages/types` (shared Zod schemas & TS types)

## Commands

| Action            | Command                                     |
| ----------------- | ------------------------------------------- |
| Dev (all)         | `pnpm dev`                                  |
| Dev (API only)    | `pnpm --filter @stillbuilding/api dev`      |
| Dev (mobile only) | `pnpm --filter @stillbuilding/mobile start` |
| Type check        | `pnpm check-types`                          |
| Lint              | `pnpm lint`                                 |
| Format            | `pnpm format`                               |
| Build             | `pnpm build`                                |
| Add dependency    | `pnpm --filter <pkg-name> add <dep>`        |

## Formatting

- **API** (`apps/api`): Biome (`pnpm --filter @stillbuilding/api format`)
- **Mobile & Types**: Prettier (`pnpm format`)

## Rules

Detailed conventions are in [`.agents/rules/`](.agents/rules/):

- [API Architecture](.agents/rules/api-architecture.md) — module structure, auth middleware, error handling
- [Mobile Architecture](.agents/rules/mobile-architecture.md) — directory layout, styling conventions
- [Mobile UI Patterns](.agents/rules/mobile-ui-patterns.md) — `react-native-modal` quirks, animation gotchas
- [State Management](.agents/rules/state-management.md) — TanStack Query hooks, Zustand stores, Pomodoro state
