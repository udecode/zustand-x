import { GetRecord, ImmerStoreApi, State } from '../types';

export const generateStateTrackedHooksSelectors = <T extends State>(
  useTrackedStore: () => T,
  store: ImmerStoreApi<T>
) => {
  const selectors: GetRecord<T> = {} as any;

  Object.keys((store as any).getState()).forEach((key) => {
    selectors[key as keyof T] = () => {
      return useTrackedStore()[key as keyof T];
    };
  });

  return selectors;
};
