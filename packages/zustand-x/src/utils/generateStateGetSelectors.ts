import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TGetStoreRecord, TState } from '../types';

export const generateStateGetSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
>(
  store: TCreatedStoreType<StateType, Mutators>
) => {
  const selectors: TGetStoreRecord<StateType> =
    {} as TGetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = () =>
      store.getState()[key as keyof StateType];
  });

  return selectors;
};
