import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TSetStoreRecord, TState } from '../types';

export const generateStateActions = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
>(
  store: TCreatedStoreType<StateType, Mutators>,
  storeName?: string,
  isMutative?: boolean
) => {
  const actions: TSetStoreRecord<StateType> = {} as TSetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    const typedKey = key as keyof StateType;
    actions[typedKey] = (value, mutative) => {
      const prevValue = store.getState()[typedKey];
      if (prevValue === value) return;
      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      const debugLog = storeName ? `@@${storeName}/set${actionKey}` : undefined;
      const _isMutative = mutative || isMutative;
      //@ts-ignore
      store.setState?.(
        _isMutative
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
