import { TGetSelectorRecord, TReadonlyStoreApi } from '../types';

export const generateStateTrackedHooksSelectors = <T>(
  useTrackedStore: () => T,
  store: TReadonlyStoreApi<T>
) => {
  const selectors: TGetSelectorRecord<T> = {} as TGetSelectorRecord<T>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof T] = () => {
      return useTrackedStore()[key as keyof T];
    };
  });

  return selectors;
};
