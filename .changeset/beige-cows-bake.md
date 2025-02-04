---
'zustand-x': major
---

The store hooks are now part of the public API. Previously accessible only through the `store` object, they are now available as standalone hooks to ensure compatibility with the new React Compiler. Added standalone hooks: `useStoreValue`, `useStoreState`, `useTracked`, `useTrackedStore`.

We're moving away from object namespaces like `use`, `get`, `set` to a more functional approach where the first argument is the store state field. This includes the extended selectors and actions, where the parameters follow the first argument. This change simplifies the API and makes it more consistent with React hooks. Instead of accessing state through object properties (`store.use.name()`), we now use functions with the state field as the first argument (`store.useValue('name')`).

Migration cases:

```ts
// Before: store.use.name(), store.use.extendedSelector(1, 2, (a, b) => a === b)
useStoreValue(store, 'name');
useStoreValue(store, 'extendedSelector', 1, 2, (a, b) => a === b);
// Equivalent to
store.useValue('name');
store.useValue('extendedSelector', 1, 2, (a, b) => a === b);

// Before: store.useTracked.name()
useTracked(store, 'name');
// Equivalent to
store.useTracked('name');

// Before: store.get.name(), store.get.extendedSelector(1, 2), store.get.state()
store.get('name');
store.get('extendedSelector', 1, 2);
store.get('state');

// Before: store.set.name('value'), store.set.extendedAction(1, 2), store.set.state(draft => { ... })
store.set('name', 'value');
store.set('extendedAction', 1, 2);
store.set('state', (draft) => {});
```

- Remove `mapValuesKey`. This would be the equivalent:

```ts
const stores = {
  auth: authStore,
  combobox: comboboxStore,
};

useValue(stores.auth, 'name');
useValue(stores.combobox, 'name');
```
