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
  ArrayElement,
  DefaultMutators,
  ResolveMutators,
  TBaseStoreOptions,
  TName,
  TState,
  TStateApi,
  TStoreInitiatorType,
  TuplifyUnion,
} from './types';
import { TFlattenMiddlewares, TMiddleware } from './types/middleware';
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
    OptionMutators extends [
      StoreMutatorIdentifier,
      unknown,
    ][] = DefaultMutators<StateType, Options>,
    MiddlewarePreviousMutators extends [
      StoreMutatorIdentifier,
      unknown,
    ][] = DefaultMutators<StateType, Options>,
    Middlewares extends TMiddleware<
      StateType,
      MiddlewarePreviousMutators
    >[] = TMiddleware<StateType, MiddlewarePreviousMutators>[],
  >(
    initialState: StateType | TStoreInitiatorType<StateType, Mps, Mcs>,
    options: Options & {
      middlewares?: Middlewares;
    } = {} as Options
  ) => {
    type Mutators = ResolveMutators<
      OptionMutators,
      TFlattenMiddlewares<TuplifyUnion<ArrayElement<Middlewares>>>,
      Mcs
    >;
    const { devtools, persist, immer, middlewares: _middlewares } = options;

    const middlewares = [] as unknown as Middlewares;

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
    if (Array.isArray(_middlewares) && _middlewares.length > 0) {
      middlewares.push(..._middlewares);
    }

    const stateMutators = middlewares.reduce(
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
