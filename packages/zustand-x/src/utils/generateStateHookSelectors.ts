import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TEqualityChecker,
  TGetStoreEqualityRecord,
  TStoreSelectorType,
} from '../types';

export const generateStateHookSelectors = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][] = [],
>(
  useStore: <R>(
    selector: TStoreSelectorType<StateType, R>,
    equalityFn?: TEqualityChecker<R>
  ) => R,
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
