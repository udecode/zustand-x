import { createStore as createStoreVanilla } from 'zustand/vanilla';

import { buildStateCreator } from '../internal/buildStateCreator';
import { createBaseApi } from '../internal/createBaseApi';
import { storeFactory } from '../internal/storeFactory';
import { DefaultMutators, TBaseStoreOptions, TState } from '../types';

import type { TBaseStateApi } from '../types/baseStore';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

export const createVanillaStore = <
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
  const store = createStoreVanilla(builder.stateCreator);

  const baseApi = createBaseApi<StateType, Mutators, {}, {}>(store, {
    name: builder.name,
    isMutative: builder.isMutative,
  });

  return storeFactory(baseApi);
};

export type TCreateVanillaStoreReturn<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
  TActions extends Record<string, (...args: any[]) => any> = {},
  TSelectors extends Record<string, (...args: any[]) => any> = {},
> = TBaseStateApi<StateType, Mutators, TActions, TSelectors>;
