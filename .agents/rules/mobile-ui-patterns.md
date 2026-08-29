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
