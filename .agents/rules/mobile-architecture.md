# Mobile Architecture (`apps/mobile`)

## Directory Layout

- `app/` — Screen routes via Expo Router v6 (file-based): `(auth)`, `(tabs)`, `project`, `task`, `pomodoro`
- `features/` — Domain logic by feature (`auth`, `blocker`, `pomodoro`, `project`, `task`), each containing hooks, components, and API callers
- `components/` — Shared/atomic reusable UI components
- `lib/` — Client configs (React Query client in `reactQuery.ts`, Axios instance in `axios.ts`)
- `utils/` — Shared utility functions

## Styling

- NativeWind v5 / Tailwind CSS v4
- Use NativeWind utility classes with consistent spacing and design tokens
- **Conditional Shadows / Variables**: If toggling `shadow-*` or dynamic variable classes conditionally, always add `will-change-variable` to the base `className` (see `mobile-ui-patterns.md`).
