> [!NOTE] > `@udecode/zustood` has been renamed to `zustand-x`.
> Using Jotai? See [JotaiX](https://github.com/udecode/jotai-x).

# ZustandX

[Zustand](https://github.com/pmndrs/zustand) is a small, fast and
scalable state-management solution battle-tested against common
pitfalls, like the dreaded
[zombie child problem](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children),
[react concurrency](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md),
and [context loss](https://github.com/facebook/react/issues/13332)
between mixed renderers. It may be the one state-manager in the React
space that gets all of these right.

As `zustand` is un-opinionated by design, it's challenging to find out the
best patterns to use when creating stores, often leading to boilerplate
code.

`zustand-x`, built on top of `zustand`, is providing a powerful store factory
which solves these challenges, so you can focus on your app.

```bash
yarn add zustand@latest zustand-x
```

### Why `zustand-x` in addition to `zustand`?

- Much less boilerplate
- Modular state management:
  - Derived selectors
  - Derived actions
- `immer`, `devtools` , `mutative` and `persist` middlewares
- Full typescript support
- `react-tracked` support

## Create a store

```ts
import { createStore } from 'zustand-x';

const repoStore = createStore(
  {
    name: 'zustandX',
    stars: 0,
    owner: {
      name: 'someone',
      email: 'someone@xxx.com',
    },
  },
  {
    name: 'repo',
  }
);
```

- the parameter of the first function is the name of the store, this is
  helpful when you have multiple stores
- the parameter of the second function is the initial state of your
  store
- the main difference with zustand is that you don't need to define a
  getter and a setter for each field, these are generated by zustand-x

Note that the zustand store is accessible through:

```ts
// hook store
repoStore.useStore;

// vanilla store
repoStore.store;
```

## Selectors

### Hooks

Use the hooks in React components, no providers needed. Select your
state and the component will re-render on changes. Use the `use` method:

```ts
repoStore.use.name();
repoStore.use.stars();
```

We recommend using the global hooks (see below) to support ESLint hook
linting.

### Tracked Hooks

> Big thanks for [react-tracked](https://github.com/dai-shi/react-tracked)

Use the tracked hooks in React components, no providers needed. Select your
state and the component will trigger re-renders only if the **accessed property** is changed. Use the `useTracked` method:

```ts
repoStore.useTracked.owner();
```

### Getters

Don't overuse hooks. If you don't need to subscribe to the state, use
instead the `get` method:

```ts
repoStore.get.name();
repoStore.get.stars();
```

You can also get the whole state:

```ts
repoStore.get.state();
```

### Extend selectors

You generally want to write derived selectors (those depending on other
selectors) for reusability. ZustandX supports extending selectors with
full typescript support:

```ts
const repoStore = createStore(
  {
    name: 'zustandX',
    stars: 0,
    middlewares: ['immer', 'devtools', 'persist'],
  },
  {
    name: 'repo',
  }
)
  .extendSelectors((state, get, api) => ({
    validName: () => get.name().trim(),
    // other selectors
  }))
  .extendSelectors((state, get, api) => ({
    // get.validName is accessible
    title: (prefix: string) =>
      `${prefix + get.validName()} with ${get.stars()} stars`,
  }));
// extend again...
```

## Actions

Update your store from anywhere by using the `set` method:

```ts
repoStore.set.name('new name');
repoStore.set.stars(repoStore.get.stars + 1);
```

### Extend actions

You can update the whole state from your app:

```ts
store.set.state((draft) => {
  draft.name = 'test';
  draft.stars = 1;
  return draft;
});
```

However, you generally want to create derived actions for reusability.
ZustandX supports extending actions with full typescript support:

```ts
const repoStore = createStore(
  {
    name: 'zustandX',
    stars: 0,
  },
  {
    name: 'repo',
  }
)
  .extendActions((set, get, api) => ({
    validName: (name: string) => {
      set.name(name.trim());
    },
    // other actions
  }))
  .extendActions((set, get, api) => ({
    reset: (name: string) => {
      // set.validName is accessible
      set.validName(name);
      set.stars(0);
    },
  }));
// extend again...
```

## Global store

After having created many stores, it can be difficult to remember which
one to import. By combining all the stores, selectors and actions, just
pick what you need using TS autocomplete.

```ts
import { combineStores } from 'zustand-x';

export const stores = combineStores({
  auth: authStore,
  combobox: comboboxStore,
  contextMenu: contextMenuStore,
  editor: editorStore,
  modal: modalStore,
  repo: repoStore,
  toolbar: toolbarStore,
});

// Global hook selectors
export const useStores = combineStores(rootStore);

// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

// Global getter selectors
export const store = mapValuesKey('get', rootStore);

// Global actions
export const actions = mapValuesKey('set', rootStore);
```

### Global hook selectors

```ts
useStore().repo.name();
useStore().modal.isOpen();
```

### Global tracked hook selectors

```tsx
// with useTrackStore UserEmail Component will only re-render when accessed property owner.email changed
const UserEmail = () => {
  const owner = useTrackedStore().repo.owner()
  return (
    <div>
      <span>User Email: {owner.email}</span>
    </div>
  );
};

// with useStore UserEmail Component re-render when owner changed, but you can pass equalityFn to avoid it.
const UserEmail = () => {
  const owner = useStore().repo.owner()
  // const owner = useStore().repo.owner((prev, next) => prev.email === next.email)
  return (
    <div>
      <span>User Email: {owner.email}</span>
    </div>
  );
};
```

By using `useStore() or useTrackStore()`, ESLint will correctly lint hook errors.

### Global getter selectors

```ts
store.repo.name();
store.modal.isOpen();
```

These can be used anywhere.

### Global actions

```ts
actions.repo.stars(store.repo.stars + 1);
actions.modal.open();
```

These can be used anywhere.

## Options

The second parameter of `createStore` is for options:

```ts
export interface CreateStoreOptions {
  name: string;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
  mutative?: MutativeOptions;
  persist?: PersistOptions;
}
```

### Middlewares

ZustandX is using these middlewares:

- `immer`: enabled if `immer.enabled` option is `true`. `immer` implements from [zustand](https://github.com/pmndrs/zustand?tab=readme-ov-file#immer-middleware).
- `devtools`: enabled if `devtools.enabled` option is `true`. `devtools` implements `DevtoolsOptions` interface from [zustand](https://github.com/pmndrs/zustand?tab=readme-ov-file#redux-devtools).
- `mutative`: enabled if `mutative.enabled` option is `true`.
- `persist`: enabled if `persist.enabled` option is `true`. `persist`
  implements `PersistOptions` interface from
  [zustand](https://github.com/pmndrs/zustand#persist-middleware)
- custom middlewares can be added by wrapping `state initiator`.

```ts
import { createStore } from 'zustand-x';
import { combine } from 'zustand/middleware';

const store = createStore<{ name: string; stars?: number }>(
  combine(
    () => ({
      name: 'zustandX',
    }),
    () => ({ stars: 0 })
  ),
  {
    name: 'repo',
    //enables persist middleware
    persist: {
      enabled: true,
    },
  }
);
```

## Contributing and project organization

### Ideas and discussions

[Discussions](https://github.com/udecode/zustand-x/discussions) is the best
place for bringing opinions and contributions. Letting us know if we're
going in the right or wrong direction is great feedback and will be much
appreciated!

#### [Become a Sponsor!](https://github.com/sponsors/zbeyens)

### Contributors

🌟 Stars and 📥 Pull requests are welcome! Don't hesitate to **share
your feedback** here. Read our
[contributing guide](https://github.com/udecode/zustand-x/blob/main/CONTRIBUTING.md)
to get started.

## License

[MIT](https://github.com/udecode/zustand-x/blob/main/LICENSE)
