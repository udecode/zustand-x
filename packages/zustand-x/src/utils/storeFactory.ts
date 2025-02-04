import { StoreMutatorIdentifier } from 'zustand';

import { TState, TStateApi, TStateApiForBuilder } from '../types';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

import type { AnyFunction } from '../types';

export const storeFactory = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
): TStateApi<StateType, Mutators, TActions, TSelectors> => {
  return {
    ...api,
    actions: api.actions || {},
    extendSelectors: (builder) =>
      storeFactory(extendSelectors(builder, api) as any),
    extendActions: (builder) =>
      storeFactory(extendActions(builder, api) as any),
  } as TStateApi<StateType, Mutators, TActions, TSelectors>;
};
