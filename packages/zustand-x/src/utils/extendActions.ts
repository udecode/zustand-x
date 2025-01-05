import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TState, TStateApiForBuilder } from '../types';

export const extendActions = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TActionBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  const actions = builder(api.set, api.get, api);

  return {
    ...api,
    set: {
      ...api.set,
      ...actions,
    },
  };
};
