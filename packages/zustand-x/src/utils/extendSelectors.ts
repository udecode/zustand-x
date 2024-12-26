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

  Object.entries(builder(api.set, api.get, api)).forEach(([key, selector]) => {
    //@ts-ignore
    use[key] =
      typeof selector === 'function'
        ? (...args: any[]) =>
            api.useStore(() => {
              return selector(...args);
            })
        : selector;
    //@ts-ignore
    useTracked[key] =
      typeof selector === 'function'
        ? (...args: any[]) => {
            return selector(...args);
          }
        : selector;
    //@ts-ignore
    get[key] =
      typeof selector === 'function'
        ? (...args: any[]) => {
            return selector(...args);
          }
        : selector;
  });

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
