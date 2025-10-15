import { createTrackedSelector } from 'react-tracked';
import { createWithEqualityFn as createStoreZustand } from 'zustand/traditional';

import { buildStateCreator } from './internal/buildStateCreator';
import { createBaseApi } from './internal/createBaseApi';
import { DefaultMutators, TBaseStoreOptions, TState } from './types';
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
  const builder = buildStateCreator(initializer, options);
  const store = createStoreZustand(builder.stateCreator);

  const useTrackedStore = createTrackedSelector(store);

  const useTracked = (key: string) => {
    return useTrackedStore()[key as keyof StateType];
  };

  const baseApi = createBaseApi<StateType, Mutators, {}, {}>(store, {
    name: builder.name,
    isMutative: builder.isMutative,
  });

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

    return [value, (val: any) => baseApi.set(key as keyof StateType, val)];
  };

  const apiInternal = {
    ...baseApi,
    store,
    useStore: store,
    useValue,
    useState,
    useTracked,
    useTrackedStore,
  } as any as TStateApiForBuilder<StateType, Mutators>;

  return storeFactory(apiInternal);
};

// Alias {@link createStore}
export const createZustandStore = createStore;
