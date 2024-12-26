import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TStateApi } from '../types';

export const extendActions = <
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TActionBuilder<
    TName,
    StateType,
    Mutators,
    TActions,
    TSelectors
  >,
>(
  builder: Builder,
  api: TStateApi<TName, StateType, Mutators, TActions, TSelectors>
) => {
  const actions = builder(api.set, api.get, api);

  return {
    ...api,
    set: {
      ...api.set,
      ...actions,
    },
  } as TStateApi<
    TName,
    StateType,
    Mutators,
    TActions & ReturnType<Builder>,
    TSelectors
  >;
};
