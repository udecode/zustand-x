import { ActionBuilder, State, StateActions, StoreApi } from '../types';

export const extendActions = <
  AB extends ActionBuilder<TName, T, StateActions<T> & TActions, TSelectors>,
  TName extends string,
  T extends State = {},
  TActions = {},
  TSelectors = {},
>(
  builder: AB,
  api: StoreApi<TName, T, StateActions<T> & TActions, TSelectors>
): StoreApi<
  TName,
  T,
  StateActions<T> & TActions & ReturnType<AB>,
  TSelectors
> => {
  const actions = builder(api.set, api.get, api);

  return {
    ...(api as any),
    set: {
      ...api.set,
      ...actions,
    },
  };
};
