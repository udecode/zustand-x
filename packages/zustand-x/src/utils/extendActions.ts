import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TName, TState, TStateApi } from '../types';

export const extendActions = <
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TActionBuilder<
    Name,
    StateType,
    Mutators,
    TActions,
    TSelectors
  >,
>(
  builder: Builder,
  api: TStateApi<Name, StateType, Mutators, TActions, TSelectors>
) => {
  const actions = builder(api.set, api.get, api);

  return {
    ...api,
    set: {
      ...api.set,
      ...actions,
    },
  } as TStateApi<
    Name,
    StateType,
    Mutators,
    TActions & ReturnType<Builder>,
    TSelectors
  >;
};
