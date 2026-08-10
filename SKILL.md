---
name: react-mui-redux-clean-code
description: Use this skill whenever writing, reviewing, or refactoring React frontend code that uses MUI (Material UI) and Redux (Redux Toolkit). Covers component structure, reusability, folder organization, state management patterns, and naming conventions. Trigger this whenever the user asks to build a component, page, form, or feature in a React + MUI + Redux codebase, or asks to "clean up" / "refactor" / "review" existing React code.
---

# React + MUI + Redux Clean Code

A practical checklist and set of conventions for writing clean, maintainable, reusable React frontend code with MUI and Redux Toolkit.

## Core Principles (apply to every file you write)

1. **One component, one responsibility.** If a component renders more than one distinct "thing" (e.g. a form AND a data table), split it.
2. **Reusable > specific.** Before writing a component, ask: "could this be used in another screen if I make props generic instead of hardcoded?" Prefer `props` over hardcoded text/values.
3. **Container vs Presentational split.** Keep data-fetching / Redux logic separate from pure UI rendering. UI components should ideally not know where their data comes from.
4. **No magic values.** Strings, colors, spacing, API routes → constants or theme tokens, never inline literals repeated across files.
5. **Small files.** If a component file exceeds ~150-200 lines, it's a signal to extract sub-components or hooks.

---

## Folder Structure

Keep it simple — flat, type-based structure under `src/`:

```
src/
├── app/
│   ├── store.ts             # Redux store config
│   └── hooks.ts              # useAppDispatch / useAppSelector
├── components/                # Reusable UI pieces (used by 2+ pages)
│   ├── AppButton.tsx
│   ├── UserCard.tsx
│   └── ConfirmDialog.tsx
├── pages/                      # Route-level components (one per screen/route)
│   ├── UsersPage.tsx
│   └── DashboardPage.tsx
├── hooks/                       # Custom reusable hooks
│   └── useDebouncedValue.ts
├── redux/                        # All slices + RTK Query APIs live here
│   ├── usersSlice.ts
│   └── usersApi.ts
├── types/                         # Shared TS types/interfaces
│   └── user.ts
├── theme/                          # MUI theme config
│   └── theme.ts
└── utils/                           # Plain helper functions, constants
    └── formatDate.ts
```

Rules of thumb:

- **`pages/`** = one file per route, wired to Redux (a "container"). It fetches data and passes it down as props.
- **`components/`** = presentational, reusable pieces. If a component only ever appears in one page, it's fine to keep it small and simple, but if it starts being reused, promote it here.
- **`redux/`** = all slices and API files together, so state logic is easy to find in one place instead of hunting through folders.
- If a page's supporting components genuinely never get reused and there are many of them, it's fine to co-locate them as `pages/UsersPage/` with a small `components/` folder inside — but don't do this until you actually need it. Start flat.

---

## React Component Rules

- **Functional components + hooks only.** No class components.
- **Props destructuring at the top** of the function signature, not scattered `props.x` calls.
- **Default props via default parameters**, not `defaultProps` (deprecated pattern for function components).
- **Extract repeated JSX into sub-components**, even small ones (e.g. `<StatusBadge status={status} />` instead of copy-pasted `<Chip>` logic in five places).
- **Custom hooks for reusable logic**, not components. If two components share non-UI logic (e.g. debounce, form validation, polling), extract a `useXyz` hook into `src/hooks/`.
- **Avoid prop drilling beyond 2 levels.** Use Redux, Context, or composition (children props) instead.
- **Keep JSX readable**: extract complex conditional rendering into a named variable or small helper function above the return statement, rather than nesting ternaries in JSX.
- **Type every prop.** Define a `Props` type/interface above the component — never rely on inferred `any`. Enable `strict` mode in `tsconfig.json`.
- **Avoid `any`.** Use `unknown` + narrowing, or proper generics. If you truly can't type something yet, add a `// TODO: type this` comment rather than silently leaving `any`.
- **Type shared domain models once** in `src/types/` (e.g. `User`, `Order`) and import them everywhere instead of redefining inline shapes per component.
- **Extend a wrapped component's props** with `ComponentProps<typeof X>` instead of manually re-declaring every prop MUI already types for you (see `AppButton` below).

### Example: Reusable component done right

```tsx
// src/components/AppButton.tsx
import Button from "@mui/material/Button";
import type { ComponentProps } from "react";

type AppButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

/**
 * Wraps MUI Button with app-wide defaults so styling stays consistent
 * and can be changed in one place.
 */
export default function AppButton({
  children,
  variant = "contained",
  loading = false,
  disabled = false,
  ...rest
}: AppButtonProps) {
  return (
    <Button variant={variant} disabled={disabled || loading} {...rest}>
      {loading ? "Loading…" : children}
    </Button>
  );
}
```

Notice: no hardcoded label, no hardcoded color, props are fully typed by extending MUI's own `Button` props, `...rest` keeps it flexible, and it's usable anywhere.

---

## MUI Conventions

- **Centralize the theme.** All colors, spacing, typography, breakpoints go in `src/theme/theme.ts` via `createTheme()`. Never hardcode hex colors or px values inline — use `theme.palette`, `theme.spacing()`.
- **Use the `sx` prop for one-off styling**, but if the same `sx` block is repeated 2+ times, move it into a `styled()` component or the theme.
- **Prefer `styled()` or theme overrides over inline `style={{}}`.** Inline styles bypass the theme and break dark-mode/consistency.
- **Use MUI layout primitives** (`Stack`, `Grid`, `Box`) instead of raw `div`s with manual flexbox CSS, so spacing stays consistent with the theme.
- **Wrap common MUI components** (Button, TextField, Dialog) in your own thin wrapper components (like `AppButton` above) when you find yourself repeating the same props — this gives you one place to change app-wide behavior later.
- **Icons**: import individually (`import SaveIcon from '@mui/icons-material/Save'`), never the whole icon package, to keep bundle size sane.

---

## Redux (Redux Toolkit) Conventions

- **Always use Redux Toolkit** (`createSlice`, `configureStore`) — never legacy plain Redux with hand-written action types/reducers/switch statements.
- **One slice per feature/domain**, not one giant slice. `usersSlice`, `authSlice`, `cartSlice` — not one `appSlice` with everything.
- **Async logic via `createAsyncThunk` or RTK Query.** Prefer **RTK Query** for anything that's just "fetch data from an API" — it removes the need for manual loading/error state.
- **Type the slice state.** Define a `UsersState` interface for the slice and pass it as the generic to `createSlice<UsersState>`. Import shared entity types (e.g. `User`) from `src/types/`.
- **Selectors live next to the slice**, exported from the same file, typed against `RootState`, and components use selectors instead of reaching into `state.feature.deeplyNested.value` directly:

```ts
// src/redux/usersSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import type { User } from "../types/user";

interface UsersState {
  list: User[];
  loading: boolean;
}

const initialState: UsersState = { list: [], loading: false };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export const selectAllUsers = (state: RootState) => state.users.list;
export const selectUserById = (id: string) => (state: RootState) =>
  state.users.list.find((u) => u.id === id);
export default usersSlice.reducer;
```

- **Typed hooks**: create `useAppDispatch` / `useAppSelector` once in `app/hooks.ts`, typed against `RootState` and `AppDispatch`, and use those everywhere instead of the raw `useDispatch`/`useSelector`:

```ts
// src/app/hooks.ts
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

- **Keep components dumb about Redux internals.** A presentational component should receive data/callbacks as props; only a container/page component should call `useAppSelector`/`useAppDispatch`.
- **Never mutate state outside of Redux Toolkit's Immer-powered reducers.** Inside `createSlice` reducers, "mutating" syntax is fine (RTK handles immutability), but never mutate Redux state directly in a component or thunk.
- **Normalize list data** (e.g. via `createEntityAdapter<User>()`) when you have collections you'll look up/update by id — avoids array-searching bugs, makes updates O(1), and gives you typed selectors for free.

---

## Naming Conventions

| What                    | Convention                       | Example                          |
| ----------------------- | -------------------------------- | -------------------------------- |
| Component file          | PascalCase, `.tsx`               | `UserCard.tsx`                   |
| Hook file/function      | camelCase, `use` prefix, `.ts`   | `useDebouncedValue.ts`           |
| Redux slice file        | camelCase, `Slice` suffix, `.ts` | `usersSlice.ts`                  |
| Redux action            | verb-based, camelCase            | `fetchUsers`, `updateUserStatus` |
| Type/interface          | PascalCase, no `I` prefix        | `User`, `UsersState`             |
| Props type              | Component name + `Props`         | `UserCardProps`                  |
| Boolean props/state     | `is`/`has`/`should` prefix       | `isLoading`, `hasError`          |
| Event handler props     | `on` prefix                      | `onSave`, `onClose`              |
| Event handler functions | `handle` prefix                  | `handleSaveClick`                |

---

## Quick Pre-Commit Checklist

Before finishing any component/feature, verify:

- [ ] No hardcoded colors/spacing — using theme tokens
- [ ] No component file over ~200 lines
- [ ] No prop-drilled data beyond 2 levels
- [ ] No `any` types left in — used `unknown` + narrowing or proper generics instead
- [ ] Every component has a typed `Props` interface/type
- [ ] Redux state accessed via selectors, not raw `state.x.y.z`
- [ ] Loading/error states handled (via RTK Query or thunk status)
- [ ] Repeated JSX blocks extracted into components
- [ ] Repeated logic extracted into custom hooks
- [ ] Meaningful prop names, no `data`, `obj`, `item2` type placeholders left in
- [ ] Component works with different prop values (not accidentally hardcoded to one use case)

---

## Note on backend choice

This skill is frontend-only (React/MUI/Redux) and is agnostic to your backend — it works the same whether you end up pairing it with .NET, Node, or anything else, since the frontend just talks to whatever API contract you expose.
