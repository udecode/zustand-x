import { GetRecord, ImmerStoreApi, State } from '../types';

export const generateStateGetSelectors = <T extends State>(
  store: ImmerStoreApi<T>
) => {
  const selectors: GetRecord<T> = {} as any;

  Object.keys((store as any).getState()).forEach((key) => {
    // selectors[`get${capitalize(key)}`] = () => store.getState()[key as keyof T];
    selectors[key as keyof T] = () => store.getState()[key as keyof T];
  });

  return selectors;
};
