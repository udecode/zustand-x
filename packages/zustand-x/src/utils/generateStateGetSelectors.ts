import { TGetSelectorRecord, TReadonlyStoreApi } from './types.v2';

export const generateStateGetSelectors = <T>(store: TReadonlyStoreApi<T>) => {
  const selectors: TGetSelectorRecord<T> = {} as TGetSelectorRecord<T>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof T] = () => store.getState()[key as keyof T];
  });

  return selectors;
};
