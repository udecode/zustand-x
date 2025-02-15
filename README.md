# Zustand X

An extension for [Zustand](https://github.com/pmndrs/zustand) that auto-generates type-safe actions, selectors, and hooks for your state. Built with TypeScript and React in mind.

## Features

- Auto-generated type-safe hooks for each state field
- Simple patterns: `store.get('name')` and `store.set('name', value)`
- Extend your store with computed values using `extendSelectors`
- Add reusable actions with `extendActions`
- Built-in support for devtools, persist, immer, and mutative

## Why

Built on top of `zustand`, `zustand-x` offers a better developer experience with less boilerplate. Create and interact with stores faster using a more intuitive API.

> Looking for React Context-based state management instead of global state? Check out [Jotai X](https://github.com/udecode/jotai-x) - same API, different state model.

## Installation

```bash
pnpm add zustand-x
```

You'll also need `react` and [`zustand`](https://github.com/pmndrs/zustand) installed.

## Quick Start

Here's how to create a simple store:

```tsx
import { createStore, useStoreState, useStoreValue } from 'zustand-x';

// Create a store with an initial state
const repoStore = createStore({
  name: 'ZustandX',
  stars: 0,
});

// Use it in your components
function RepoInfo() {
  const name = useStoreValue(repoStore, 'name');
  const stars = useStoreValue(repoStore, 'stars');

  return (
    <div>
      <h1>{name}</h1>
      <p>{stars} stars</p>
    </div>
  );
}

function AddStarButton() {
  const [, setStars] = useStoreState(repoStore, 'stars');
  return <button onClick={() => setStars((s) => s + 1)}>Add star</button>;
}
```

## Core Concepts

### Store Configuration

The store is where everything begins. Configure it with type-safe middleware:

```ts
import { createStore } from 'zustand-x';

// Types are inferred, including middleware options
const userStore = createStore(
  {
    name: 'Alice',
    loggedIn: false,
  },
  {
    name: 'user',
    devtools: true, // Enable Redux DevTools
    persist: true, // Persist to localStorage
    mutative: true, // Enable immer-style mutations
  }
);
```

Available middleware options:

```ts
{
  name: string;
  devtools?: boolean | DevToolsOptions;
  persist?: boolean | PersistOptions;
  immer?: boolean | ImmerOptions;
  mutative?: boolean | MutativeOptions;
}
```

### Reading and Writing State

The API is designed to be intuitive. Here's how you work with state:

#### Reading State

```ts
// Get a single value
store.get('name'); // => 'Alice'

// Get the entire state
store.get('state');

// Call a selector with arguments
store.get('someSelector', 1, 2);
```

#### Writing State

```ts
// Set a single value
store.set('name', 'Bob');

// Call an action
store.set('someAction', 10);

// Update multiple values at once
store.set('state', (draft) => {
  draft.name = 'Bob';
  draft.loggedIn = true;
});
```

### Subscribing State
```ts
// Subscribe to changes
const unsubscribe = store.subscribe('name', (name, previousName) => {
  console.log('Name changed from', previousName, 'to', name);
});

// Subscribe to the entire state
const unsubscribe = store.subscribe('state', (state) => {
  console.log('State changed:', state);
});

// Subscribe to a selector with arguments
const unsubscribe = store.subscribe('someSelector', 1, 2, (result) => {
  console.log('Selector result changed:', result);
});

// Subscribe with an additional selector and options
const unsubscribe = store.subscribe(
  'name',
  name => name.length,
  length => console.log('Name length changed:', length),
  { fireImmediately: true } // Fire the callback immediately when subscribing
);
```

### React Hooks

#### `useStoreValue(store, key, ...args)`

Subscribe to a single value or selector. Optionally pass an equality function for custom comparison:

```ts
const name = useStoreValue(store, 'name');

// With selector arguments
const greeting = useStoreValue(store, 'greeting', 'Hello');

// With custom equality function for arrays/objects
const items = useStoreValue(
  store,
  'items',
  (a, b) => a.length === b.length && a.every((item, i) => item.id === b[i].id)
);
```

#### `useStoreState(store, key, [equalityFn])`

Get a value and its setter, just like `useState`. Perfect for form inputs:

```ts
function UserForm() {
  const [name, setName] = useStoreState(store, 'name');
  const [email, setEmail] = useStoreState(store, 'email');

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}
```

#### `useTracked(store, key)`

Subscribe to a value with minimal re-renders. Perfect for large objects where you only use a few fields:

```ts
function UserEmail() {
  // Only re-renders when user.email changes
  const user = useTracked(store, 'user');
  return <div>{user.email}</div>;
}

function UserAvatar() {
  // Only re-renders when user.avatar changes
  const user = useTracked(store, 'user');
  return <img src={user.avatar} />;
}
```

#### `useTrackedStore(store)`

Get the entire store with tracking.

```ts
function UserProfile() {
  // Only re-renders when accessed fields change
  const state = useTrackedStore(store);

  return (
    <div>
      <h1>{state.user.name}</h1>
      <p>{state.user.bio}</p>
      {state.isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Extending Your Store

#### Adding Selectors

Selectors help you derive new values from your state. Chain them together to build complex computations:

```ts
const store = createStore(
  { firstName: 'Jane', lastName: 'Doe' },
  { mutative: true }
);

const extendedStore = store
  .extendSelectors(({ get }) => ({
    fullName: () => get('firstName') + ' ' + get('lastName'),
  }))
  .extendSelectors(({ get }) => ({
    fancyTitle: (prefix: string) => prefix + get('fullName').toUpperCase(),
  }));

// Using them
extendedStore.get('fullName'); // => 'Jane Doe'
extendedStore.get('fancyTitle', 'Hello '); // => 'Hello JANE DOE'
```

Use them in components:

```ts
function Title() {
  const fancyTitle = useStoreValue(extendedStore, 'fancyTitle', 'Welcome ')
  return <h1>{fancyTitle}</h1>
}
```

#### Adding Actions

Actions are functions that modify state. They can read or write state and even compose with other actions:

```ts
const storeWithActions = store.extendActions(
  ({ get, set, actions: { someActionToOverride } }) => ({
    updateName: (newName: string) => set('name', newName),
    resetState: () => {
      set('state', (draft) => {
        draft.firstName = 'Jane';
        draft.lastName = 'Doe';
      });
    },
    someActionToOverride: () => {
      // You could call the original if you want:
      // someActionToOverride()
      // then do more stuff...
    },
  })
);

// Using actions
storeWithActions.set('updateName', 'Julia');
storeWithActions.set('resetState');
```

### Middleware Configuration

Each middleware can be enabled with a simple boolean or configured with options:

```ts
const store = createStore(
  { name: 'ZustandX', stars: 10 },
  {
    name: 'repo',
    devtools: { enabled: true }, // Redux DevTools with options
    persist: { enabled: true }, // localStorage with options
    mutative: true, // shorthand for { enabled: true }
  }
);
```

### Zustand Store

Access the underlying Zustand store when needed:

```ts
// Use the original Zustand hook
const name = useStoreSelect(store, (state) => state.name);

// Get the vanilla store
const vanillaStore = store.store;
vanillaStore.getState();
vanillaStore.setState({ count: 1 });

// Subscribe to changes
const unsubscribe = vanillaStore.subscribe((state) =>
  console.log('New state:', state)
);
```

## Comparison with Zustand

```ts
// zustand
import create from 'zustand'

const useStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  // Computed values need manual memoization
  double: 0,
  setDouble: () => set((state) => ({ double: state.count * 2 }))
}))

// Component
const count = useStore((state) => state.count)
const increment = useStore((state) => state.increment)
const double = useStore((state) => state.double)

// zustand-x
import { createStore, useStoreValue, useStoreState } from 'zustand-x'

const store = createStore({ count: 0 })
  .extendSelectors(({ get }) => ({
    // Computed values are auto-memoized
    double: () => get('count') * 2
  }))
  .extendActions(({ set }) => ({
    increment: () => set('count', (count) => count + 1),
  }))

// Component
const count = useStoreValue(store, 'count')
const double = useStoreValue(store, 'double')
const increment = () => store.set('increment')
```

Key differences:

- No need to create selectors manually - they're auto-generated for each state field
- Direct access to state fields without selector functions
- Simpler action definitions with `set('key', value)` pattern
- Type-safe by default without extra type annotations
- Computed values are easier to define and auto-memoized with `extendSelectors`

## Migration to v6

```ts
// Before
store.use.name();
store.get.name();
store.set.name('Bob');

// Now
useStoreValue(store, 'name');
store.get('name');
store.set('name', 'Bob');

// With selectors and actions
// Before
store.use.someSelector(42);
store.set.someAction(10);

// Now
useStoreValue(store, 'someSelector', 42);
store.set('someAction', 10);
```

## License

[MIT](./LICENSE)
