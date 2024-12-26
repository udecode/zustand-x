import { createTrackedSelector } from 'react-tracked';
import { createStore as createStoreZustand } from 'zustand';
import {
  devtools as devToolsMiddleware,
  DevtoolsOptions,
  persist as persistMiddleware,
  PersistOptions,
} from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  TActionBuilder,
  TEqualityChecker,
  TSelectorBuilder,
  TStateApi,
  TStoreMiddlewareStateCreatorType,
  TStoreSelectorType,
} from './types';
import { extendActions, extendSelectors } from './utils';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

type TCreateStoreOptions<StateType> = {
  persist?: Partial<PersistOptions<StateType>> & {
    enabled?: boolean;
  };
  devtools?: Partial<DevtoolsOptions> & {
    enabled?: boolean;
  };
};
type TStoreMiddlewares<StateType> = [
  ['zustand/devtools', never],
  ['zustand/persist', StateType],
];
export const createStore =
  <TName extends string>(name: TName) =>
  <
    StateType,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  >(
    createState: StateCreator<StateType, Mps, Mcs>,
    options: TCreateStoreOptions<StateType> = {}
  ) => {
    const { devtools, persist } = options;

    const middlewares: ((
      initializer: StateCreator<StateType, any, any>
    ) => StateCreator<StateType, any, any>)[] = [];

    if (devtools?.enabled) {
      middlewares.push((config) =>
        devToolsMiddleware(config, { ...devtools, name })
      );
    }

    if (persist?.enabled) {
      middlewares.push((config) =>
        persistMiddleware(config, {
          ...persist,
          name: persist.name ?? name,
        })
      );
    }
    type Mutators = [...TStoreMiddlewares<StateType>, ...Mcs];
    const stateMutators = middlewares.reduce(
      (y: any, fn) => fn(y),
      createState
    ) as TStoreMiddlewareStateCreatorType<StateType, [], Mutators>;

    const store = createStoreZustand(stateMutators);

    const getterSelectors = generateStateGetSelectors(store);

    const useStore = <FilteredStateType>(
      selector: TStoreSelectorType<StateType, FilteredStateType>,
      equalityFn?: TEqualityChecker<FilteredStateType>
    ): FilteredStateType => useStoreWithEqualityFn(store, selector, equalityFn);

    const stateActions = generateStateActions(store, name);

    const hookSelectors = generateStateHookSelectors(useStore, store);

    const useTrackedStore = createTrackedSelector(useStore);
    const trackedHooksSelectors = generateStateTrackedHooksSelectors(
      useTrackedStore,
      store
    );

    const apiInternal: TStateApi<TName, StateType, Mutators> = {
      getInitialState: store.getInitialState,
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
      useStore,
      use: hookSelectors,
      useTracked: trackedHooksSelectors,
      useTrackedStore,
      extendSelectors: () => apiInternal as any,
      extendActions: () => apiInternal as any,
    };

    return storeFactory(apiInternal) as TStateApi<TName, StateType, Mutators>;
  };

const storeFactory = <
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
>(
  api: TStateApi<TName, StateType, Mutators>
) => {
  return {
    ...api,
    extendSelectors: (builder: TSelectorBuilder<TName, StateType>) =>
      storeFactory(extendSelectors(builder, api)),
    extendActions: (builder: TActionBuilder<TName, StateType>) =>
      storeFactory(extendActions(builder, api)),
  };
};

// const test = createStore('hello')(() => ({ hey: 'aa' }))
//   .extendSelectors(() => {
//     return {
//       selector: 'asas',
//     };
//   })
//   .extendActions(() => {
//     return {
//       action: 'as',
//     };
//   });

// test.set.action === ""

// Alias {@link createStore}
export const createZustandStore = createStore;
