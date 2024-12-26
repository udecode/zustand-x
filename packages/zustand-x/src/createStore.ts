import { enableMapSet, setAutoFreeze } from 'immer';
import { createTrackedSelector } from 'react-tracked';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import {
  devToolsMiddleware,
  DevtoolsOptions,
  immerMiddleware,
  ImmerOptions,
  persistMiddleware,
  PersistOptions,
} from './middlewares';
import { TStateApi, TStoreInitiatorType } from './types';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { storeFactory } from './utils/storeFactory';

import type { StoreMutatorIdentifier } from 'zustand';

type TCreateStoreOptions<StateType> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
};

type DefaultMutators<
  StateType,
  Options extends TCreateStoreOptions<StateType>,
> = [
  ...(Options['immer'] extends { enabled: true }
    ? [['zustand/immer', never]]
    : []),
  ...(Options['persist'] extends { enabled: true }
    ? [['zustand/persist', StateType]]
    : []),
  ...(Options['devtools'] extends { enabled: true }
    ? [['zustand/devtools', never]]
    : []),
];

type ResolveMutators<
  StateType,
  Options extends TCreateStoreOptions<StateType>,
  Mcs extends [StoreMutatorIdentifier, unknown][],
> = [...DefaultMutators<StateType, Options>, ...Mcs];

export const createStore =
  <TName extends string>(name: TName) =>
  <
    StateType,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
    Options extends
      TCreateStoreOptions<StateType> = TCreateStoreOptions<StateType>,
    Mutators extends [StoreMutatorIdentifier, unknown][] = ResolveMutators<
      StateType,
      Options,
      Mcs
    >,
  >(
    createState: TStoreInitiatorType<StateType, Mps, Mutators>,
    options: Options = {} as Options
  ) => {
    const { devtools, persist, immer } = options;

    const middlewares: ((
      initializer: TStoreInitiatorType<StateType, any, any, any>
    ) => TStoreInitiatorType<StateType, any, any, any>)[] = [];

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

    const stateMutators = middlewares.reduce(
      (y: any, fn) => fn(y),
      createState
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
      useStore: store,
      use: hookSelectors,
      useTracked: trackedHooksSelectors,
      useTrackedStore,
      extendSelectors: () => apiInternal as any,
      extendActions: () => apiInternal as any,
    };

    return storeFactory(apiInternal) as TStateApi<TName, StateType, Mutators>;
  };

// Alias {@link createStore}
export const createZustandStore = createStore;
