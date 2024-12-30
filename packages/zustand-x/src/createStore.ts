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
import { getOptions } from './utils/helpers';
import { storeFactory } from './utils/storeFactory';

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

export const createStore = <
  StateType extends TState,
  Name extends TName = TName,
  CreateStoreOptions extends TBaseStoreOptions<
    StateType,
    Name
  > = TBaseStoreOptions<StateType, Name>,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initialState: StateType | StateCreator<StateType, Mps, Mcs>,
  options: CreateStoreOptions & { name: Name }
) => {
  type Mutators = ResolveMutators<
    DefaultMutators<Name, StateType, CreateStoreOptions>,
    Mcs
  >;
  const {
    devtools: devtoolsOptions,
    persist: persistOptions,
    immer: immerOptions,
    name,
  } = options;

  //current middlewares order devTools(persist(immer(initiator)))
  const middlewares: TMiddleware[] = [];

  //enable devtools
  const _devtoolsOptionsInternal = getOptions(devtoolsOptions);
  if (_devtoolsOptionsInternal.enabled) {
    middlewares.push((config) =>
      devToolsMiddleware(config, {
        ..._devtoolsOptionsInternal,
        name: _devtoolsOptionsInternal?.name ?? name,
      })
    );
  }

  //enable persist
  const _persistOptionsInternal = getOptions(persistOptions);
  if (_persistOptionsInternal.enabled) {
    middlewares.push((config) =>
      persistMiddleware(config, {
        ..._persistOptionsInternal,
        name: _persistOptionsInternal.name ?? name,
      })
    );
  }

  //enable immer
  //by default immer is enabled
  const _immerOptionsInternal = getOptions(immerOptions, true);
  if (_immerOptionsInternal.enabled) {
    setAutoFreeze(_immerOptionsInternal.enabledAutoFreeze ?? false);
    if (_immerOptionsInternal.enableMapSet) {
      enableMapSet();
    }
    middlewares.push(immerMiddleware);
  }

  const stateMutators = middlewares
    .reverse()
    .reduce(
      (y, fn) => fn(y),
      (typeof initialState === 'function'
        ? initialState
        : () => initialState) as StateCreator<StateType>
    ) as StateCreator<StateType, [], Mutators>;

  const store = createStoreZustand(stateMutators);

  const getterSelectors = generateStateGetSelectors(store);

  const stateActions = generateStateActions(
    store,
    name,
    _immerOptionsInternal.enabled
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
