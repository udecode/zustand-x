import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TEqualityChecker,
  TGetStoreEqualityRecord,
  TUseStoreSelectorType,
} from '../types';

export const generateStateHookSelectors = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][],
>(
  useStore: <FilteredStateType>(
    selector: TUseStoreSelectorType<StateType, FilteredStateType>,
    equalityFn?: TEqualityChecker<FilteredStateType>
  ) => FilteredStateType,
  store: TCreatedStoreType<StateType, Middlewares>
) => {
  const selectors: TGetStoreEqualityRecord<StateType> =
    {} as TGetStoreEqualityRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = (
      equalityFn?: TEqualityChecker<StateType[keyof StateType]>
    ) => {
      return useStore((state) => state[key as keyof StateType], equalityFn);
    };
  });

  return selectors;
};
