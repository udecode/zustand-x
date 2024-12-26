import { createTrackedSelector } from 'react-tracked';
import {
  devtools as devToolsMiddleware,
  DevtoolsOptions,
  persist as persistMiddleware,
  PersistOptions,
} from 'zustand/middleware';
import { immer as immerMiddleware } from 'zustand/middleware/immer';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import { TStateApi, TStoreInitiatorType } from './types';
import { generateStateActions } from './utils/generateStateActions';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { storeFactory } from './utils/storeFactory';

import type { StoreMutatorIdentifier } from 'zustand';

type TCreateStoreOptions<StateType> = {
  persist?: Partial<PersistOptions<StateType>> & {
    enabled?: boolean;
  };
  devtools?: Partial<DevtoolsOptions> & {
    enabled?: boolean;
  };
  immer?: {
    enabled?: boolean;
  };
};

type DefaultMutators<
  StateType,
  Options extends TCreateStoreOptions<StateType>,
> = [
  ...(Options['devtools'] extends { enabled: true }
    ? [['zustand/devtools', never]]
    : []),
  ...(Options['persist'] extends { enabled: true }
    ? [['zustand/persist', StateType]]
    : []),
  ...(Options['immer'] extends { enabled: true }
    ? [['zustand/immer', never]]
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

    //enable devtools
    if (devtools && devtools.enabled) {
      middlewares.push((config) =>
        devToolsMiddleware(config, { ...devtools, name: devtools.name ?? name })
      );
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

    //enable immer
    if (immer && immer.enabled) {
      middlewares.push(immerMiddleware);
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
