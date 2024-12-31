import { createTrackedSelector } from 'react-tracked';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from './middlewares';
import { mutativeMiddleware } from './middlewares/mutative';
import { DefaultMutators, TBaseStoreOptions, TState } from './types';
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
  CreateStoreOptions extends
    TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initialState: StateType | StateCreator<StateType, Mps, Mcs>,
  options: CreateStoreOptions
) => {
  type Mutators = [...DefaultMutators<StateType, CreateStoreOptions>, ...Mcs];
  const {
    devtools: devtoolsOptions,
    persist: persistOptions,
    immer: immerOptions,
    mutative: mutativeOptions,
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
  const _immerOptionsInternal = getOptions(immerOptions);
  if (_immerOptionsInternal.enabled) {
    middlewares.push((config) =>
      immerMiddleware(config, _immerOptionsInternal)
    );
  }
  //enable mutative
  const _mutativeOptionsInternal = getOptions(mutativeOptions);
  if (_mutativeOptionsInternal.enabled) {
    middlewares.push((config) =>
      mutativeMiddleware(config, _mutativeOptionsInternal)
    );
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
