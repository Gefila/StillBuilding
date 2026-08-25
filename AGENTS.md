# Project StillBuilding - AI Agent Guidelines

## 1. Project Overview & Workflow

**StillBuilding** is a personal productivity and deep-work companion application consisting of:

- **Personal Task & Project Manager**: Organizing individual goals, projects, and actionable tasks.
- **Pomodoro Tracker**: Focused work interval timer linked to active tasks and projects.
- **Blocker Logger**: Tracking friction points, interruptions, and blockers encountered during deep work sessions.

---

## 2. Monorepo & Git Repository Structure

- **Monorepo Structure**: The repository uses **pnpm workspaces** and **Turborepo**:
  - `apps/api/` - Express.js API backend (`@stillbuilding/api`).
  - `apps/mobile/` - React Native Expo application (`@stillbuilding/mobile`).
  - `packages/types/` - Shared TypeScript types, domain models, and Zod validation schemas (`@stillbuilding/types`).
- **Terminal & Development Commands**:
  - Run all apps concurrently: `pnpm dev` (runs both API and mobile dev servers via Turborepo with TUI).
  - Run API only: `pnpm --filter @stillbuilding/api dev`.
  - Run mobile only: `pnpm --filter @stillbuilding/mobile start` (or `dev`).
  - Run type checks across all workspaces: `pnpm check-types`.
  - Run linters across workspaces: `pnpm lint`.
  - Format code: `pnpm format` (Prettier for root/mobile/types, Biome for `@stillbuilding/api`).
  - Build all packages: `pnpm build`.
  - Install dependency to a specific workspace: `pnpm --filter <pkg-name> add <dependency>`.

---

## 3. Tech Stack & Architecture

### Backend API (`apps/api`)

- **Runtime & Language**: Node.js, TypeScript (`tsx` for dev watcher, `tsc` for build)
- **Framework**: Express.js (v5) with Helmet, CORS, and Morgan
- **Database & Auth**: Supabase (`@supabase/supabase-js`)
  - Auth: Supabase Auth (JWT token sent via `Authorization: Bearer <token>`, validated via `authMiddleware`).
- **Validation**: Zod (using schemas from `@stillbuilding/types` and module-specific schemas).
- **Linter & Formatter**: Biome (`pnpm --filter @stillbuilding/api lint` / `format` / `check`).
- **Architecture**: Modular structure (`src/modules/<ModuleName>/`):
  - Modules: `Auth`, `Projects`, `Tasks`, `Pomodoro-sessions`, `Blocker-logs`.
  - Module files:
    - `<module>.routes.ts` - Express routes with middleware bindings.
    - `<module>.controller.ts` - Request extraction & response dispatching.
    - `<module>.service.ts` - Business logic & Supabase database queries.
  - Middlewares (`src/middlewares/`): `auth.middleware.ts`, `error.middleware.ts`.

### Mobile App (`apps/mobile`)

- **Framework**: React Native with Expo (SDK 54) & Expo Router v6 (`app/` file-based routing).
- **Bundler & Styling**: Metro configured for monorepo workspace resolution (`metro.config.js`), NativeWind v5 / Tailwind CSS v4.
- **State Management**:
  - **Server State / Caching**: TanStack Query (`@tanstack/react-query`) for fetching, caching, and mutations (`lib/reactQuery.ts`).
  - **Client State**: Zustand for local/client state (timer, active session, UI filters).
- **Forms & Validation**: React Hook Form with `@hookform/resolvers` + Zod schemas.
- **API Client**: Axios (`lib/axios.ts`) configured with base URL and Supabase JWT interceptor.
- **Architecture**:
  - `app/` - Screen routes (`(auth)`, `(tabs)`, `project`, `task`, `pomodoro`).
  - `features/` - Domain logic organized by feature (`auth`, `blocker`, `pomodoro`, `project`, `task`) containing hooks, components, and API callers.
  - `components/` - Shared and atomic reusable UI components.
  - `lib/` - Client configurations, React Query client, and Axios instance.
  - `utils/` - Shared utility functions.

### Shared Types Package (`packages/types`)

- Contains domain models, TypeScript interfaces, and Zod validation schemas (`@stillbuilding/types`):
  - `auth.types.ts`, `blocker.types.ts`, `pomodoro.types.ts`, `project.types.ts`, `task.types.ts`.

---

## 4. Coding Guidelines & Standards

1. **Strict Typing**: No `any`. Use strongly typed interfaces and schemas from `@stillbuilding/types`.
2. **Server State Management**:
   - Use TanStack Query hooks (`useQuery`, `useMutation`) inside `features/<feature>/hooks/` with proper cache invalidation on mutations.
3. **Backend Security & Error Handling**:
   - All protected routes must use `authMiddleware` to verify the Supabase JWT.
   - Handlers should forward unexpected errors to `next(err)` to trigger the global error handler (`error.middleware.ts`).
4. **Code Quality**:
   - Formatting: `pnpm format` / Biome for backend (`pnpm --filter @stillbuilding/api format`).
   - Typechecking: `pnpm check-types`.
   - Frontend styling: Use NativeWind utility classes with consistent spacing and design tokens.
