---
'zustand-x': minor
---

- Introduced a React-free `createVanillaStore` in `zustand-x/vanilla` using `zustand/vanilla`.
- Extracted shared internal logic (`middleware`, `options parsing`, `selector/action helpers`) to `src/internal` for reuse.
- Refactored React entry (`createStore`, hooks) to use shared internal logic without breaking existing API.
- Split types: base hook-free definitions vs React-specific types for compatibility with both entries.
- Updated package exports to include `./vanilla` while keeping `.` for React.
- Added vanilla-focused tests to ensure store functionality works without React.
- Ensured middleware, selector/action extensions, and mutative utilities work in both vanilla and React contexts.
- **Example usage (vanilla, no React):**

```ts
import { createVanillaStore } from 'zustand-x/vanilla';

const counterStore = createVanillaStore(
  { count: 0 },
  { name: 'vanilla-counter', persist: true }
)
  .extendSelectors(({ get }) => ({
    doubled: () => get('count') * 2,
  }))
  .extendActions(({ set }) => ({
    increment: () => set('count', (value) => value + 1),
  }));

counterStore.actions.increment();
console.log(counterStore.get('doubled')); // 2
```
