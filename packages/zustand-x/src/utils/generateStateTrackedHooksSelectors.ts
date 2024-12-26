import { TGetStoreRecord, TReadonlyStoreApi } from '../types';

export const generateStateTrackedHooksSelectors = <StateType>(
  useTrackedStore: () => StateType,
  store: TReadonlyStoreApi<StateType>
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
