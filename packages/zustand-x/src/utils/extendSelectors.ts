import { StoreMutatorIdentifier } from 'zustand';

import { TSelectorBuilder, TState, TStateApiForBuilder } from '../types';

export const extendSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions,
  TSelectors,
  Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
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
        ? (...args: unknown[]) =>
            api.useStore(() => {
              return selector(...args);
            })
        : selector;
    //@ts-ignore
    useTracked[key] =
      typeof selector === 'function'
        ? (...args: unknown[]) => {
            return selector(...args);
          }
        : selector;
    //@ts-ignore
    get[key] =
      typeof selector === 'function'
        ? (...args: unknown[]) => {
            return selector(...args);
          }
        : selector;
  });

  return {
    ...api,
    get,
    use,
    useTracked,
  };
};
