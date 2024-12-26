import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TGetStoreRecord, TState } from '../types';

export const generateStateTrackedHooksSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
>(
  useTrackedStore: () => StateType,
  store: TCreatedStoreType<StateType, Mutators>
) => {
  const selectors: TGetStoreRecord<StateType> =
    {} as TGetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = () => {
      return useTrackedStore()[key as keyof StateType];
    };
  });

  return selectors;
};
