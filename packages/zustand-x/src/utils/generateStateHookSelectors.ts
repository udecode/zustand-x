import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TEqualityChecker,
  TGetStoreEqualityRecord,
} from '../types';

export const generateStateHookSelectors = <
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
>(
  useStore: TCreatedStoreType<StateType, Mutators>
) => {
  const selectors: TGetStoreEqualityRecord<StateType> =
    {} as TGetStoreEqualityRecord<StateType>;

  Object.keys(useStore.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = (
      equalityFn?: TEqualityChecker<StateType[keyof StateType]>
    ) => {
      return useStore((state) => state[key as keyof StateType], equalityFn);
    };
  });

  return selectors;
};
