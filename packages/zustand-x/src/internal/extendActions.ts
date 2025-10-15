import type {
  AnyFunction,
  TActionBuilder,
  TBaseStateApiForBuilder,
} from '../types/baseStore';
import type { TState } from '../types/utils';
import type { StoreMutatorIdentifier } from 'zustand';

export const extendActions = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TActionBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  const newActions = builder(api);
  const actions = {
    ...api.actions,
    ...newActions,
  } as TActions & ReturnType<Builder>;

  return {
    ...api,
    actions,
    set: ((key: string, ...args: unknown[]) => {
      if (key in actions) {
        const action = actions[key];
        return action?.(...args);
      }

      return api.set(key as any, args[0]);
    }) as typeof api.set,
  } as TBaseStateApiForBuilder<
    StateType,
    Mutators,
    TActions & ReturnType<Builder>,
    TSelectors
  >;
};
