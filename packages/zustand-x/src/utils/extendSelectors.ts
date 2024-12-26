import { StoreMutatorIdentifier } from 'zustand';

import { TSelectorBuilder, TStateApi } from '../types';

export const extendSelectors = <
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TSelectorBuilder<
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
  const use = {
    ...api.use,
  };

  const useTracked = {
    ...api.useTracked,
  };

  const get = {
    ...api.get,
  };

  Object.entries(builder(api.store.getState(), api.get, api)).forEach(
    ([key, value]) => {
      console.log(value, 'value');
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
    }
  );

  return {
    ...api,
    get,
    use,
    useTracked,
  } as TStateApi<
    TName,
    StateType,
    Mutators,
    TActions,
    TSelectors & ReturnType<Builder>
  >;
};
