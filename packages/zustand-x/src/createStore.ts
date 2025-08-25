import { createTrackedSelector } from 'react-tracked';
import { subscribeWithSelector } from 'zustand/middleware';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from './middlewares';
import { mutativeMiddleware } from './middlewares/mutative';
import { DefaultMutators, TBaseStoreOptions, TState } from './types';
import { TMiddleware } from './types/middleware';
import { getOptions } from './utils/helpers';
import { storeFactory } from './utils/storeFactory';

import type { TStateApiForBuilder } from './types';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Creates zustand store with additional selectors and actions.
 *
 * @param {StateType | StateCreator<StateType, Mps, Mcs>} initializer - A function or object that initializes the state.
 * @param {TBaseStoreOptions<StateType>} options - store create options.
 */

export const createStore = <
  StateType extends TState,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  CreateStoreOptions extends
    TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>,
>(
  initializer: StateType | StateCreator<StateType, Mps, Mcs>,
  options: CreateStoreOptions
) => {
  type Mutators = [...DefaultMutators<StateType, CreateStoreOptions>, ...Mcs];
  const {
    name,
    devtools: devtoolsOptions,
    immer: immerOptions,
    mutative: mutativeOptions,
    persist: persistOptions,
    isMutativeState,
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
      (typeof initializer === 'function'
        ? initializer
        : () => initializer) as StateCreator<StateType>
    ) as StateCreator<StateType, [], Mutators>;

  const store = createStoreZustand(subscribeWithSelector(stateMutators));

  const useTrackedStore = createTrackedSelector(store);

  const useTracked = (key: string) => {
    return useTrackedStore()[key as keyof StateType];
  };

  const getFn = (key: string) => {
    if (key === 'state') {
      return store.getState();
    }

    return store.getState()[key as keyof StateType];
  };

  const subscribeFn = (
    key: string,
    selector: any,
    listener: any,
    subscribeOptions: any
  ) => {
    if (key === 'state') {
      // @ts-expect-error -- typescript is unable to infer the 3 args version
      return store.subscribe(selector, listener, subscribeOptions);
    }

    let wrappedSelector: any;

    if (listener) {
      // subscribe(selector, listener, subscribeOptions) variant
      wrappedSelector = (state: StateType) =>
        selector(state[key as keyof StateType]);
    } else {
      // subscribe(listener) variant
      listener = selector;
      wrappedSelector = (state: StateType) => state[key as keyof StateType];
    }

    // @ts-expect-error -- typescript is unable to infer the 3 args version
    return store.subscribe(wrappedSelector, listener, subscribeOptions);
  };

  const isMutative =
    isMutativeState ||
    _immerOptionsInternal.enabled ||
    _mutativeOptionsInternal.enabled;

  const setFn = (key: string, value: any) => {
    if (key === 'state') {
      return (store.setState as any)(value);
    }

    const typedKey = key as keyof StateType;
    const prevValue = store.getState()[typedKey];

    if (typeof value === 'function') {
      value = value(prevValue);
    }
    if (prevValue === value) return;

    const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
    const debugLog = name ? `@@${name}/set${actionKey}` : undefined;

    (store.setState as any)?.(
      isMutative
        ? (draft: StateType) => {
            draft[typedKey] = value;
          }
        : { [typedKey]: value },
      undefined,
      debugLog
    );
  };

  const useValue = (
    key: string,
    equalityFn?: (oldValue: any, newValue: any) => boolean
  ) => {
    return store((state) => state[key as keyof StateType], equalityFn);
  };

  const useState = (
    key: string,
    equalityFn?: (oldValue: any, newValue: any) => boolean
  ) => {
    const value = useValue(key, equalityFn);

    return [value, (val: any) => setFn(key, val)];
  };

  const apiInternal = {
    get: getFn,
    name,
    set: setFn,
    subscribe: subscribeFn,
    store,
    useStore: store,
    useValue,
    useState,
    useTracked,
    useTrackedStore,
    actions: {},
    selectors: {},
  } as any as TStateApiForBuilder<StateType, Mutators>;

  return storeFactory(apiInternal);
};

// Alias {@link createStore}
export const createZustandStore = createStore;
