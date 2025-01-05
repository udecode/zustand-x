---
'zustand-x': major
---

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
    const store = createStore({
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
