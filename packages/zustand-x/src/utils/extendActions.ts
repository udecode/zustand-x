import { TActionBuilder, TStateApi } from '../types';

export const extendActions = <
  TName,
  StateType,
  TActions,
  TSelectors,
  Builder extends TActionBuilder<TName, StateType, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApi<TName, StateType, TActions, TSelectors>
) => {
  const actions = builder(api.set, api.get, api);

  return {
    ...api,
    set: {
      ...api.set,
      ...actions,
    },
  } as TStateApi<TName, StateType, TActions & ReturnType<Builder>, TSelectors>;
};
