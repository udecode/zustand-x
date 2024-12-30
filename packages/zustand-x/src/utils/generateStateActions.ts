import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TSetStoreRecord, TState } from '../types';

export const generateStateActions = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
>(
  store: TCreatedStoreType<StateType, Mutators>,
  storeName?: string,
  isImmerEnabled?: boolean
) => {
  const actions: TSetStoreRecord<StateType> = {} as TSetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    const typedKey = key as keyof StateType;
    actions[typedKey] = (value) => {
      const prevValue = store.getState()[typedKey];
      if (prevValue === value) return;
      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      const debugLog = storeName ? `@@${storeName}/set${actionKey}` : undefined;

      const extraParams: unknown[] = [debugLog];
      if (isImmerEnabled) {
        extraParams.unshift(true);
      }

      //@ts-ignore
      store.setState(
        (state: StateType) => {
          state[typedKey] = value;
          if (!isImmerEnabled) {
            return { ...state };
          }
        },
        ...extraParams
      );
    };
  });

  return actions;
};
