# API Architecture (`apps/api`)

## Module Structure

All backend logic lives in `src/modules/<ModuleName>/`:

- `<module>.routes.ts` — Express routes with middleware bindings
- `<module>.controller.ts` — Request extraction & response dispatching
- `<module>.service.ts` — Business logic & Supabase database queries

Modules: `Auth`, `Projects`, `Tasks`, `Pomodoro-sessions`, `Blocker-logs`.

## Auth & Security

- All protected routes **must** use `authMiddleware` (`src/middlewares/auth.middleware.ts`) to verify the Supabase JWT.
- JWT is sent via `Authorization: Bearer <token>`.

## Error Handling

- Forward unexpected errors to `next(err)` to trigger the global error handler (`src/middlewares/error.middleware.ts`).
- Never swallow errors in controllers or services.

## Validation

- Use Zod schemas from `@stillbuilding/types` for shared domain validation.
- Module-specific request schemas live alongside their module files.
