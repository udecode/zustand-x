import { storeFactory as storeFactoryBase } from '../internal/storeFactory';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

import type {
  AnyFunction,
  TState,
  TStateApi,
  TStateApiForBuilder,
} from '../types';
import type { StoreMutatorIdentifier } from 'zustand';

export const storeFactory = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
): TStateApi<StateType, Mutators, TActions, TSelectors> => {
  return storeFactoryBase(api, {
    extendSelectors: (builder, baseApi) =>
      extendSelectors(builder, baseApi as any) as any,
    extendActions: (builder, baseApi) =>
      extendActions(builder, baseApi as any) as any,
  }) as TStateApi<
    StateType,
    Mutators,
    TActions,
    TSelectors
  >;
};
