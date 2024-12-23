import { TCreatedStoreType, TSetRecord } from './types.v2';

export const generateStateActions = <T, U>(
  store: TCreatedStoreType<T, U>,
  storeName: string
) => {
  const actions: TSetRecord<T> = {} as TSetRecord<T>;

  Object.keys(store.getState() || {}).forEach((key) => {
    actions[key as keyof T] = (value) => {
      const prevValue = store.getState()[key as keyof T];
      if (prevValue === value) return;

      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      store.setState(
        (state) => {
          state[key as keyof T] = value;
          return state;
        },
        undefined,
        `@@${storeName}/set${actionKey}`
      );
    };
  });

  return actions;
};
