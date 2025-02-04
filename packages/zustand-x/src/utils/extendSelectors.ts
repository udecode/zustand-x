import { StoreMutatorIdentifier } from 'zustand';

import {
  AnyFunction,
  TEqualityChecker,
  TSelectorBuilder,
  TState,
  TStateApiForBuilder,
} from '../types';

export const extendSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  const newSelectors = builder(api);
  const selectors = {
    ...api.selectors,
    ...newSelectors,
  };

  return {
    ...api,
    get: <K extends keyof (StateType & TSelectors & { state: true })>(
      key: K,
      ...args: K extends keyof TSelectors ? Parameters<TSelectors[K]> : []
    ) => {
      if (key in selectors) {
        const selector = selectors[key as keyof typeof selectors];
        return selector(...args);
      }
      return api.get(key as keyof StateType);
    },
    selectors,
    useValue: <K extends keyof (StateType & TSelectors)>(
      key: K,
      ...args: K extends keyof TSelectors
        ? [
            ...Parameters<TSelectors[K]>,
            TEqualityChecker<ReturnType<TSelectors[K]>> | undefined,
          ]
        : [TEqualityChecker<StateType[keyof StateType]> | undefined]
    ) => {
      if (key in selectors) {
        const selector = selectors[key as keyof typeof selectors];
        const lastArg = args.at(-1);
        const equalityFn = typeof lastArg === 'function' ? lastArg : undefined;
        const selectorArgs = equalityFn ? args.slice(0, -1) : args;

        return api.useStore(() => selector(...selectorArgs), equalityFn as any);
      }
      return api.useValue(
        key as keyof StateType,
        args[0] as TEqualityChecker<StateType[keyof StateType]>
      );
    },
  };
};
