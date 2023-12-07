import { ActionBuilder, State, StateActions, StoreApi } from '../types';

export const extendActions = <
  AB extends ActionBuilder<TName, T, StateActions<T> & TActions, TSelectors>,
  TName extends string,
  T extends State = {},
  TActions = {},
  TSelectors = {}
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
  // Object.keys(actions).forEach((key) => {
  //   actions[key] = (...args: any[]) => {
  //     // React batch
  //     batch(() => {
  //       actions[key](...args);
  //     });
  //   };
  // });

  return {
    ...(api as any),
    set: {
      ...api.set,
      ...actions,
    },
  };
};
