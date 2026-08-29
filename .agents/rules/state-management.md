# State Management

## Server State — TanStack Query

- All data fetching hooks (`useQuery`, `useMutation`) live in `features/<feature>/hooks/`
- Always implement proper cache invalidation on mutations (invalidate related query keys after successful mutations)

## Client State — Zustand

- Used for local/client-only state: timer, active session, UI filters

## Pomodoro Store

- `usePomodoroStore` is the **single source of truth** for the active focus task and timer
- Do not duplicate this state elsewhere
