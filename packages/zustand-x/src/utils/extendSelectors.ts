import { extendSelectors as extendSelectorsInternal } from '../internal/extendSelectors';

import type {
  AnyFunction,
  TSelectorBuilder,
  TState,
  TStateApiForBuilder,
} from '../types';
import type { StoreMutatorIdentifier } from 'zustand';

export const extendSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  return extendSelectorsInternal(builder, api, {
    selectWithStore: (selector, equalityFn) => api.useStore(selector, equalityFn),
  }) as TStateApiForBuilder<
    StateType,
    Mutators,
    TActions,
    TSelectors & ReturnType<Builder>
  >;
};
