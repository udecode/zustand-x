---
"@udecode/zustood": minor
---

`react-tracked` support

Use the tracked hooks in React components, no providers needed. Select your
state and the component will trigger re-renders only if the **accessed property** is changed. Use the `useTracked` method:

```tsx
// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

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
  // const owner = useStore().repo.owner((prev, next) => prev.owner.email === next.owner.email)
  return (
    <div>
      <span>User Email: {owner.email}</span>
    </div>
  );
};
```
