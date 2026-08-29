# State Management

## Server State — TanStack Query

- All data fetching hooks (`useQuery`, `useMutation`) live in `features/<feature>/hooks/`
- Centralize all cache updates & invalidations inside `useMutation`'s `onSuccess` callback. Never perform manual `queryClient.invalidateQueries` calls inside UI components.
- **Focus-Aware Subscription**: On tab/persistent screens, always pass `subscribed: isFocused` (from `useIsFocused()`) via `queryConfig` so inactive background screens unsubscribe from query updates.
- **Direct Cache Sync**: Always update the in-memory cache synchronously via `queryClient.setQueryData` in `onSuccess` for instant 0ms UI feedback.
- **Prefix Isolation (`exact: true`)**: Always use `exact: true` on `invalidateQueries` to prevent duplicate network requests caused by hierarchical prefix matching (e.g. `["task"]` accidentally refetching `["task", id]`).
- **Targeted Invalidation**:
  - For **primary entities** active on current screen: invalidate without `refetchType: "none"` so the foreground screen immediately re-validates with the server.
  - For **secondary/cross-entity queries** (e.g. invalidating project list when updating a task): use `refetchType: "none"` so background screens are marked stale without firing immediate background GET requests.

## Client State — Zustand

- Used for local/client-only state: timer, active session, UI filters

## Pomodoro Store

- `usePomodoroStore` is the **single source of truth** for the active focus task and timer
- Do not duplicate this state elsewhere
