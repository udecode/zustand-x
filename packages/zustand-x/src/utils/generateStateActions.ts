import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TSetStoreRecord } from '../types';

export const generateStateActions = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][],
>(
  store: TCreatedStoreType<StateType, Middlewares>,
  storeName: string
) => {
  const actions: TSetStoreRecord<StateType> = {} as TSetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    const typedKey = key as keyof StateType;
    actions[typedKey] = (value) => {
      const prevValue = store.getState()[typedKey];
      if (prevValue === value) return;

      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      store.setState(
        (state) => {
          state[typedKey] = value;
          return state;
        },
        undefined,
        `@@${storeName}/set${actionKey}`
      );
    };
  });

  return actions;
};
