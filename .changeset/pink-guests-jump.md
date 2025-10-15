---
'zustand-x': minor
---

Added `createVanillaStore`: create a vanilla Zustand store in Node.js, workers, or any non-React environment. Example:

```ts
import { createVanillaStore } from 'zustand-x/vanilla';

const store = createVanillaStore({ count: 0 }, { name: 'counter' });

store.get('count');
store.set('count', 1);
```
