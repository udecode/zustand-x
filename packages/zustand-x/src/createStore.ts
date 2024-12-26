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
import { TName, TState, TStateApi, TStoreInitiatorType } from './types';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { storeFactory } from './utils/storeFactory';

import type { StoreMutatorIdentifier } from 'zustand';

type DefaultMutators<
  StateType extends TState,
  Options extends TBaseStoreOptions<StateType>,
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
  StateType extends TState,
  Mcs extends [StoreMutatorIdentifier, unknown][],
  Options extends TBaseStoreOptions<StateType>,
> = [...DefaultMutators<StateType, Options>, ...Mcs];

type TBaseStoreOptions<StateType> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
};

type TMiddleware<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = (
  config: TStoreInitiatorType<StateType, [], Mutators, StateType>
) => TStoreInitiatorType<StateType, [], Mutators, StateType>;

type TCreateStoreOptions<
  StateType extends TState,
  Mcs extends [StoreMutatorIdentifier, unknown][],
> = TBaseStoreOptions<StateType> & {
  middlewares?: TMiddleware<StateType, Mcs>[];
};

export const createStore =
  <Name extends TName>(name: Name) =>
  <
    StateType extends TState,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
    Options extends TCreateStoreOptions<StateType, Mcs> = TCreateStoreOptions<
      StateType,
      Mcs
    >,
    Mutators extends [StoreMutatorIdentifier, unknown][] = ResolveMutators<
      StateType,
      Mcs,
      Options
    >,
  >(
    createState: StateType | TStoreInitiatorType<StateType, Mps, Mcs>,
    options: Options = {} as Options
  ) => {
    const {
      devtools,
      persist,
      immer,
      middlewares: _middlewares = [],
    } = options;

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

    //apply other middlewares
    if (_middlewares.length > 0) {
      middlewares.push(..._middlewares);
    }

    const stateMutators = middlewares.reduce(
      (y: any, fn) => fn(y),
      typeof createState === 'function' ? createState : () => createState
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

    return storeFactory(apiInternal) as TStateApi<Name, StateType, Mutators>;
  };

// Alias {@link createStore}
export const createZustandStore = createStore;
