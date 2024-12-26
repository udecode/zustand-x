import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TStateApi } from '../types';

export const extendActions = <
  TName,
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TActionBuilder<
    TName,
    StateType,
    Middlewares,
    TActions,
    TSelectors
  >,
>(
  builder: Builder,
  api: TStateApi<TName, StateType, Middlewares, TActions, TSelectors>
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
    Middlewares,
    TActions & ReturnType<Builder>,
    TSelectors
  >;
};
