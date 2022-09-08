# @udecode/zustood

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
