import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TSetStoreRecord } from '../types';

export const generateStateActions = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][] = [],
>(
  store: TCreatedStoreType<StateType, Middlewares>,
  storeName: string
) => {
  const actions: TSetStoreRecord<StateType> = {} as TSetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    actions[key as keyof StateType] = (value) => {
      const prevValue = store.getState()[key as keyof StateType];
      if (prevValue === value) return;

      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      store.setState(
        (state) => {
          state[key as keyof StateType] = value;
          return state;
        },
        undefined,
        `@@${storeName}/set${actionKey}`
      );
    };
  });

  return actions;
};
