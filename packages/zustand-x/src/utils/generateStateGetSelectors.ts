import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreType, TGetStoreRecord } from '../types';

export const generateStateGetSelectors = <
  StateType,
  Middlewares extends [StoreMutatorIdentifier, unknown][],
>(
  store: TCreatedStoreType<StateType, Middlewares>
) => {
  const selectors: TGetStoreRecord<StateType> =
    {} as TGetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = () =>
      store.getState()[key as keyof StateType];
  });

  return selectors;
};
