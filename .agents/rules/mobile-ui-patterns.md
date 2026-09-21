# Mobile UI Patterns

## `react-native-modal` — Required Settings

These are mandatory to prevent visual bugs:

| Prop                          | Value    | Why                                    |
| ----------------------------- | -------- | -------------------------------------- |
| `backdropTransitionOutTiming` | `{1}`    | Prevents backdrop flickering on close  |
| `useNativeDriver`             | `{true}` | Required for smooth animation          |
| `useNativeDriverForBackdrop`  | `{true}` | Required for smooth backdrop animation |

### ❌ Never use

- `hideModalContentWhileAnimating={true}` — causes frame flashing

### Dismissal pattern

When selecting an item from a modal triggers parent state changes or mutations, use the `onModalHide` callback (or close the modal first, then trigger state updates) to prevent UI glitching during the close animation.

## Expo Router URL Hygiene

- Avoid injecting/retaining temporary `id` query params into Expo Router URLs during internal modal interactions.

## Dynamic Styling & CSS Variables (`will-change-variable`)

In NativeWind v5 / `react-native-css`, utility classes like `shadow-*` (`shadow-xs`, `shadow-sm`, etc.) generate CSS variables internally.

When an element toggles between having a variable class and not having one (e.g., in conditional selection states), `react-native-css` logs a warning and remounts the component along with its children:

> `ReactNativeCss: className '...' added or removed a variable after the initial render. This causes the components state to be reset and all children be re-mounted. Use the className 'will-change-variable' to avoid this warning.`

### Rule

Always include `will-change-variable` in the element's base `className` whenever classes containing CSS variables (especially `shadow-*`) are added/removed conditionally:

```tsx
// ❌ WRONG: Causes component reset & remount on press/toggle
<TouchableOpacity
  className={`p-4 rounded-2xl border ${
    isSelected
      ? "bg-surface border-foreground shadow-xs"
      : "bg-surface-subtle border-border"
  }`}
/>

// ✅ CORRECT: will-change-variable in the static base class
<TouchableOpacity
  className={`p-4 rounded-2xl border will-change-variable ${
    isSelected
      ? "bg-surface border-foreground shadow-xs"
      : "bg-surface-subtle border-border"
  }`}
/>
```
