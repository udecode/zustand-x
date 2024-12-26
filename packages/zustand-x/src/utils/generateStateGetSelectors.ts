import { TGetStoreRecord, TReadonlyStoreApi } from '../types';

export const generateStateGetSelectors = <StateType>(
  store: TReadonlyStoreApi<StateType>
) => {
  const selectors: TGetStoreRecord<StateType> =
    {} as TGetStoreRecord<StateType>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof StateType] = () =>
      store.getState()[key as keyof StateType];
  });

  return selectors;
};
