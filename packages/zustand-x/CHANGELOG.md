# @udecode/zustood

## 6.0.3

### Patch Changes

- [`86582be`](https://github.com/udecode/zustand-x/commit/86582be18d07304032ece09b9a1efae594cc3b3b) by [@zbeyens](https://github.com/zbeyens) – Add `useStoreSelect`

## 6.0.2

### Patch Changes

- [`d8f922a`](https://github.com/udecode/zustand-x/commit/d8f922a49095982669318fbfdf6e0ed2aa61fee9) by [@zbeyens](https://github.com/zbeyens) – Fixes #102

## 6.0.1

### Patch Changes

- [`f5801e9`](https://github.com/udecode/zustand-x/commit/f5801e9bdbbe7e062e778b8a28543f8866fede94) by [@zbeyens](https://github.com/zbeyens) – Fix exports

## 6.0.0

### Major Changes

- [#100](https://github.com/udecode/zustand-x/pull/100) by [@zbeyens](https://github.com/zbeyens) – The store hooks are now part of the public API. Previously accessible only through the `store` object, they are now available as standalone hooks to ensure compatibility with the new React Compiler. Added standalone hooks: `useStoreValue`, `useStoreState`, `useTracked`, `useTrackedStore`.

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

  // Before: store.extendSelectors((set, get, api) => ({ ... })). Now only api argument that you can destructure.
  store.extendSelectors(({ get }) => ({ ... }));

  // Before: store.extendActions((set, get, api) => ({ ... })). Now only api argument that you can destructure.
  store.extendActions(({ set }) => ({ ... }));
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

## 5.0.1

### Patch Changes

- [#95](https://github.com/udecode/zustand-x/pull/95) by [@imarabinda](https://github.com/imarabinda) –
  - fix: missing export `mapValuesKey`

## 5.0.0

### Major Changes

- [#92](https://github.com/udecode/zustand-x/pull/92) by [@imarabinda](https://github.com/imarabinda) –

  - Added support for Zustand 4.5.0+.
  - `mutative` support. Pass `mutative: true` in the options.

  ## Migration Instructions

  Update the Store Initialization:

  1. Replace the old method of initializing the store with the new API.

     ```tsx
     const store = createStore(
       () => ({
         name: 'zustandX',
         stars: 0,
       }),
       {
         name: 'repo',
         immer: true,
       }
     );
     ```

     or

     ```tsx
     const store = createStore(
       {
         name: 'zustandX',
         stars: 0,
       },
       {
         name: 'repo',
         immer: true,
       }
     );
     ```

  2. Ensure to pass the configuration object with name and other options as needed.
  3. If your application relies on immer, enable it by passing immer: true in the configuration object.

     ```tsx
     const store = createStore(
       () => ({
         name: 'zustandX',
         stars: 0,
       }),
       {
         name: 'repo',
         immer: true,
       }
     );
     ```

  4. With the new version, integrating middlewares has also changed. Here's how to upgrade your middleware usage:

     ```tsx
     const store = createStore(
       middlewareWrapHere(() => ({
         name: 'zustandX',
         stars: 0,
       })),
       {
         name: 'repo',
         immer: true,
       }
     );
     ```

## 3.0.4

### Patch Changes

- [`18e8f6e`](https://github.com/udecode/zustand-x/commit/18e8f6e9631e3ea0a31b944a54c1dfa80176564e) by [@zbeyens](https://github.com/zbeyens) – Fix doc links

## 3.0.3

### Patch Changes

- [#73](https://github.com/udecode/zustand-x/pull/73) by [@marbemac](https://github.com/marbemac) – Support partial state objects in the persist typings

## 3.0.2

### Patch Changes

- [`78b2899`](https://github.com/udecode/zustand-x/commit/78b2899a7780c57d8d04a4e82d0ae60e252377c6) by [@zbeyens](https://github.com/zbeyens) – Replace lodash with lodash.mapvalues

## 3.0.1

### Patch Changes

- [#69](https://github.com/udecode/zustand-x/pull/69) by [@zbeyens](https://github.com/zbeyens) –
  - Fixes #60 – `[DEPRECATED] Passing a vanilla store will be unsupported in a future version`
  - Support `equalityFn` towards v5. See https://github.com/pmndrs/zustand/discussions/1937.

## 3.0.0

### Major Changes

- [#66](https://github.com/udecode/zustand-x/pull/66) by [@zbeyens](https://github.com/zbeyens) –
  - Rename `@udecode/zustood` package to `zustand-x`
  - `createZustandStore`: new alias for `createStore`

## 2.0.0

### Major Changes

- [#57](https://github.com/udecode/zustood/pull/57) [`2b1dbeb`](https://github.com/udecode/zustood/commit/2b1dbeb96ba86fbd31e3c731d2bd42cc22a003f0) Thanks [@enchorb](https://github.com/enchorb)! - Upgraded ﻿`zustand` to version 4, bringing in several new features and improvements.
  - Deprecated types in `zustand` v4+ were addressed by including them in the package itself.
  - Upgraded ﻿`immer` to the latest version.
  - The upgrade to `zustand` v4 and `immer` introduces enhancements, bug fixes, and performance optimizations to your application.
  - Please make sure to review the official documentation of ﻿`zustand` v4 and `immer` for any additional changes and updates.

## 1.1.3

### Patch Changes

- [#49](https://github.com/udecode/zustood/pull/49) [`0a0ee89`](https://github.com/udecode/zustood/commit/0a0ee8930d25bf4afb1ea4fd8ca7076cafab6cf3) Thanks [@GoodbyeNJN](https://github.com/GoodbyeNJN)! - fix: update `PersistOptions` typing

## 1.1.2

### Patch Changes

- [#47](https://github.com/udecode/zustood/pull/47) [`ac2379c`](https://github.com/udecode/zustood/commit/ac2379c28ea59c780e068eb609ac5037b745ce77) Thanks [@GoodbyeNJN](https://github.com/GoodbyeNJN)! - feat: support persist name is different from store name

## 1.1.1

### Patch Changes

- [#38](https://github.com/udecode/zustood/pull/38) [`8671fcd`](https://github.com/udecode/zustood/commit/8671fcd4a5de1ec17d26d6dd49aafd5ef2142c07) Thanks [@ShinyLeee](https://github.com/ShinyLeee)! - fix: selectors always cause re-render because of always return a new function
  fix: correct equalityFn typing
  docs: fix extendSelectors argument typo

## 1.1.0

### Minor Changes

- [#36](https://github.com/udecode/zustood/pull/36) [`c66963c`](https://github.com/udecode/zustood/commit/c66963c6fd56ec91d2d658421499a701742bfb69) Thanks [@ShinyLeee](https://github.com/ShinyLeee)! - `react-tracked` support

  Use the tracked hooks in React components, no providers needed. Select your
  state and the component will trigger re-renders only if the **accessed property** is changed. Use the `useTracked` method:

  ```tsx
  // Global tracked hook selectors
  export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

  // with useTrackStore UserEmail Component will only re-render when accessed property owner.email changed
  const UserEmail = () => {
    const owner = useTrackedStore().repo.owner();
    return (
      <div>
        <span>User Email: {owner.email}</span>
      </div>
    );
  };
  // with useStore UserEmail Component re-render when owner changed, but you can pass equalityFn to avoid it.
  const UserEmail = () => {
    const owner = useStore().repo.owner();
    // const owner = useStore().repo.owner((prev, next) => prev.owner.email === next.owner.email)
    return (
      <div>
        <span>User Email: {owner.email}</span>
      </div>
    );
  };
  ```

## 1.0.0

### Major Changes

- [#34](https://github.com/udecode/zustood/pull/34) [`22f07f6`](https://github.com/udecode/zustood/commit/22f07f69e05ee4ebde7a6f293367fcdd4e167fed) Thanks [@ShinyLeee](https://github.com/ShinyLeee)! - selector hooks support passing equality function

## 0.5.0

### Minor Changes

- [#32](https://github.com/udecode/zustood/pull/32) [`d3aa69c`](https://github.com/udecode/zustood/commit/d3aa69c93aac9cd359b51f804fab971740ddd3cb) Thanks [@ShinyLeee](https://github.com/ShinyLeee)! - Support logging action name when devtools enabled

## 0.4.4

### Patch Changes

- [#28](https://github.com/udecode/zustood/pull/28) [`db9a744`](https://github.com/udecode/zustood/commit/db9a744a333da999b762f1a6ab7fb5d42d90df68) Thanks [@solimer](https://github.com/solimer)! - Add enable map set to immer's options

## 0.4.3

### Patch Changes

- [#24](https://github.com/udecode/zustood/pull/24) [`29d8bb3`](https://github.com/udecode/zustood/commit/29d8bb3ce2d7ab26125df37415bcf1c6602816a5) Thanks [@zbeyens](https://github.com/zbeyens)! - fix: extended actions `get` parameter was missing the extended selectors.

## 0.4.2

### Patch Changes

- [#22](https://github.com/udecode/zustood/pull/22) [`196501f`](https://github.com/udecode/zustood/commit/196501fc4ce52fa85b6433b5e9b0782ca302cb1e) Thanks [@xuanduc987](https://github.com/xuanduc987)! - Allow deleting properties from state

## 0.4.1

### Patch Changes

- [#20](https://github.com/udecode/zustood/pull/20) [`e7ce19a`](https://github.com/udecode/zustood/commit/e7ce19a98567eb71bc60ed0c968324c11c07dbc3) Thanks [@zbeyens](https://github.com/zbeyens)! - support zustand 3.6 `PersistOptions`

## 0.4.0

### Minor Changes

- [#17](https://github.com/udecode/zustood/pull/17) [`a2b1b5c`](https://github.com/udecode/zustood/commit/a2b1b5c0c57abe4b583896256cba815137e2fef3) Thanks [@zbeyens](https://github.com/zbeyens)! - changes:
  - `createStore` options:
    - from `persist` to `persist.enabled`
    - from `devtools` to `devtools.enabled`
    - from `enableAutoFreeze` to `immer.enabledAutoFreeze`
  - types

## 0.3.0

### Minor Changes

- [#11](https://github.com/udecode/zustood/pull/11) [`25e04f8`](https://github.com/udecode/zustood/commit/25e04f8750636ef413414e702e965b20094c9539) Thanks [@zbeyens](https://github.com/zbeyens)! - fix exports

## 0.2.0

### Minor Changes

- [#9](https://github.com/udecode/zustood/pull/9) [`c893bd7`](https://github.com/udecode/zustood/commit/c893bd7fdadfa9558835d7b6c742888e3ec164fc) Thanks [@zbeyens](https://github.com/zbeyens)! - createStore options

## 0.1.0

### Minor Changes

- [#7](https://github.com/udecode/zustood/pull/7) [`2109bc5`](https://github.com/udecode/zustood/commit/2109bc575b8889e421e87d1a67e4af0bac7762f7) Thanks [@zbeyens](https://github.com/zbeyens)! - first release
