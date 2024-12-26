import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TEqualityChecker,
  TGetStoreEqualityRecord,
  TState,
} from '../types';

export const generateStateHookSelectors = <
  StateType extends TState,
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
