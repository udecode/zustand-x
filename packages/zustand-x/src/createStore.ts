import { createTrackedSelector } from 'react-tracked';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import {
  devToolsMiddleware,
  enableMapSet,
  immerMiddleware,
  persistMiddleware,
  setAutoFreeze,
} from './middlewares';
import {
  DefaultMutators,
  ResolveMutators,
  TBaseStoreOptions,
  TName,
  TState,
} from './types';
import { TMiddleware } from './types/middleware';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { storeFactory } from './utils/storeFactory';

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

export const createStore = <
  StateType extends TState,
  Options extends TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>,
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  Mutators extends [StoreMutatorIdentifier, unknown][] = ResolveMutators<
    DefaultMutators<StateType, Options>,
    Mcs
  >,
  Name extends TName = TName,
>(
  initialState: StateType | StateCreator<StateType, Mutators, Mcs>,
  options: Options & { name: Name }
) => {
  const { devtools, persist, immer, name } = options;

  const middlewares: TMiddleware[] = [];

  //enable immer
  if (immer && immer.enabled) {
    middlewares.push(immerMiddleware);
    setAutoFreeze(immer.enabledAutoFreeze ?? false);
    if (immer.enableMapSet) {
      enableMapSet();
    }
  }

  //enable persist
  if (persist && persist.enabled) {
    middlewares.push((config) =>
      persistMiddleware(config, {
        ...persist,
        name: persist.name ?? name,
      })
    );
  }

  //enable devtools
  if (devtools && devtools.enabled) {
    middlewares.push((config) =>
      devToolsMiddleware(config, { ...devtools, name: devtools.name ?? name })
    );
  }

  const stateMutators = middlewares
    .reverse()
    .reduce(
      (y, fn) => fn(y),
      (typeof initialState === 'function'
        ? initialState
        : () => initialState) as StateCreator<StateType>
    );

  const store = createStoreZustand<StateType, Mutators>(stateMutators);

  const getterSelectors = generateStateGetSelectors(store);

  const stateActions = generateStateActions(
    store,
    name,
    options.immer?.enabled
  );

  const hookSelectors = generateStateHookSelectors(store);

  const useTrackedStore = createTrackedSelector(store);
  const trackedHooksSelectors = generateStateTrackedHooksSelectors(
    useTrackedStore,
    store
  );

  const apiInternal = {
    get: {
      state: store.getState,
      ...getterSelectors,
    },
    name,
    set: {
      state: store.setState,
      ...stateActions,
    },
    store,
    useStore: store,
    use: hookSelectors,
    useTracked: trackedHooksSelectors,
    useTrackedStore,
  };

  return storeFactory(apiInternal);
};

// Alias {@link createStore}
export const createZustandStore = createStore;
