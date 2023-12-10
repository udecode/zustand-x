import {
  EqualityChecker,
  GetRecord,
  ImmerStoreApi,
  State,
  UseImmerStore,
} from '../types';

export const generateStateHookSelectors = <T extends State>(
  useStore: UseImmerStore<T>,
  store: ImmerStoreApi<T>
) => {
  const selectors: GetRecord<T> = {} as any;

  Object.keys((store as any).getState()).forEach((key) => {
    // selectors[`use${capitalize(key)}`] = () =>
    selectors[key as keyof T] = (equalityFn?: EqualityChecker<T[keyof T]>) => {
      return useStore((state: T) => state[key as keyof T], equalityFn);
    };
  });

  return selectors;
};
