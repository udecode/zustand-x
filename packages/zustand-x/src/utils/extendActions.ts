import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TState, TStateApiForBuilder } from '../types';

import type { AnyFunction } from '../types';

export const extendActions = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TActionBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  const newActions = builder(api);
  const actions = {
    ...api.actions,
    ...newActions,
  };

  return {
    ...api,
    actions,
    set: <K extends keyof (StateType | TActions)>(
      key: K,
      ...args: K extends keyof TActions
        ? Parameters<TActions[K]>
        : K extends keyof StateType
          ? [StateType[K]]
          : never
    ) => {
      if (key in actions) {
        const action = actions[key as keyof typeof actions];
        return action(...args);
      }
      return api.set(key as any, args[0]);
    },
  };
};
