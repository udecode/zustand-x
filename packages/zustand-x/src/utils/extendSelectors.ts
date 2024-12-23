import { TSelectorBuilder, TStateApi } from './types.v2';

export const extendSelectors = <
  Builder extends TSelectorBuilder<
    TName,
    StateType,
    MutatedStateType,
    TActions,
    TSelectors
  >,
  TName extends string,
  StateType,
  MutatedStateType,
  TActions,
  TSelectors,
>(
  builder: Builder,
  api: TStateApi<TName, StateType, MutatedStateType, TActions, TSelectors>
): TStateApi<
  TName,
  StateType,
  MutatedStateType,
  TActions,
  TSelectors & ReturnType<Builder>
> => {
  const use = {
    ...api.use,
  };

  const useTracked = {
    ...api.useTracked,
  };

  const get = {
    ...api.get,
  };

  Object.keys(builder(api.store.getState(), api.get, api)).forEach((key) => {
    //@ts-ignore
    use[key] = (...args: any[]) =>
      api.useStore((state) => {
        const selectors = builder(state, api.get, api);
        const selector = selectors[key];
        return selector(...args);
      });
    //@ts-ignore
    useTracked[key] = (...args: any[]) => {
      const trackedState = api.useTrackedStore();
      const selectors = builder(trackedState, api.get, api);
      const selector = selectors[key];
      return selector(...args);
    };
    //@ts-ignore
    get[key] = (...args: any[]) => {
      const selectors = builder(api.store.getState(), api.get, api);
      const selector = selectors[key];
      return selector(...args);
    };
  });

  return {
    ...api,
    get,
    use,
    useTracked,
  };
};
