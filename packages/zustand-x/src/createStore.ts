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
  TStateApi,
  TStoreInitiatorType,
} from './types';
import { TMiddleware } from './types/middleware';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { storeFactory } from './utils/storeFactory';

import type { StoreMutatorIdentifier } from 'zustand';

export const createStore =
  <Name extends TName>(name: Name) =>
  <
    StateType extends TState,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
    Options extends TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>,
  >(
    initialState: StateType | TStoreInitiatorType<StateType, Mps, Mcs>,
    options: Options = {} as Options
  ) => {
    type Mutators = ResolveMutators<DefaultMutators<StateType, Options>, Mcs>;
    const { devtools, persist, immer } = options;

    const middlewares: TMiddleware<StateType>[] = [];

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
        (y: any, fn) => fn(y),
        typeof initialState === 'function' ? initialState : () => initialState
      ) as TStoreInitiatorType<StateType, [], Mutators>;

    const store = createStoreZustand(stateMutators);

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

    const apiInternal: TStateApi<Name, StateType, Mutators> = {
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
      extendSelectors: () => apiInternal as any,
      extendActions: () => apiInternal as any,
    };

    return storeFactory(apiInternal) as TStateApi<Name, StateType, Mutators>;
  };

// Alias {@link createStore}
export const createZustandStore = createStore;
