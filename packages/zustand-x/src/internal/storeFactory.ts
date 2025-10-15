import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

import type {
  AnyFunction,
  TBaseStateApi,
  TBaseStateApiForBuilder,
} from '../types/baseStore';
import type { TState } from '../types/utils';
import type { StoreMutatorIdentifier } from 'zustand';

type StoreFactoryOverrides<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
> = {
  extendSelectors?: (
    builder: any,
    api: TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
  ) => TBaseStateApiForBuilder<
    StateType,
    Mutators,
    TActions,
    TSelectors
  >;
  extendActions?: (
    builder: any,
    api: TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
  ) => TBaseStateApiForBuilder<
    StateType,
    Mutators,
    TActions,
    TSelectors
  >;
};

export const storeFactory = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  api: TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>,
  overrides?: StoreFactoryOverrides<StateType, Mutators, TActions, TSelectors>
): TBaseStateApi<StateType, Mutators, TActions, TSelectors> => {
  const extendSelectorsImpl = overrides?.extendSelectors ?? extendSelectors;
  const extendActionsImpl = overrides?.extendActions ?? extendActions;

  return {
    ...api,
    actions: api.actions || ({} as TActions),
    extendSelectors: (builder) =>
      storeFactory(
        extendSelectorsImpl(builder, api) as any,
        overrides
      ),
    extendActions: (builder) =>
      storeFactory(extendActionsImpl(builder, api) as any, overrides),
  } as TBaseStateApi<StateType, Mutators, TActions, TSelectors>;
};
