import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TGetStoreRecord } from '../types';

export const generateStateTrackedHooksSelectors = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][],
>(
  useTrackedStore: () => StateType,
  store: TCreatedStoreType<StateType, Middlewares>
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
