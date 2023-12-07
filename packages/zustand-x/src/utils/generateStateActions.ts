import { SetRecord, State, UseImmerStore } from '../types';

export const generateStateActions = <T extends State>(
  store: UseImmerStore<T>,
  storeName: string
) => {
  const actions: SetRecord<T> = {} as any;

  Object.keys((store as any).getState()).forEach((key) => {
    actions[key as keyof T] = (value: keyof T) => {
      const prevValue = store.getState()[key as keyof T];
      if (prevValue === value) return;

      const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
      store.setState((draft) => {
        // @ts-ignore
        draft[key] = value;
      }, `@@${storeName}/set${actionKey}`);
    };
  });

  return actions;
};
