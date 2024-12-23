import {
  TCreatedStoreType,
  TEqualityChecker,
  TGetRecord,
  TStoreSelectorType,
} from './types.v2';

export const generateStateHookSelectors = <T, U>(
  useStore: <R>(
    selector: TStoreSelectorType<T, R>,
    equalityFn?: TEqualityChecker<R>
  ) => R,
  store: TCreatedStoreType<T, U>
) => {
  const selectors: TGetRecord<T> = {} as TGetRecord<T>;

  Object.keys(store.getState() || {}).forEach((key) => {
    selectors[key as keyof T] = (equalityFn?: TEqualityChecker<T[keyof T]>) => {
      return useStore((state) => state[key as keyof T], equalityFn);
    };
  });

  return selectors;
};
