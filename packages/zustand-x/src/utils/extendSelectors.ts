import { StoreMutatorIdentifier } from 'zustand';

import { TName, TSelectorBuilder, TState, TStateApi } from '../types';

export const extendSelectors = <
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TSelectorBuilder<
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
    Name,
    StateType,
    Mutators,
    TActions,
    TSelectors & ReturnType<Builder>
  >;
};
