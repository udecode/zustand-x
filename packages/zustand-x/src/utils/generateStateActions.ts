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

      //@ts-ignore
      store.setState?.(
        isImmerEnabled
          ? (draft: StateType) => {
              draft[typedKey] = value;
            }
          : { [typedKey]: value },
        undefined,
        debugLog
      );
    };
  });

  return actions;
};
