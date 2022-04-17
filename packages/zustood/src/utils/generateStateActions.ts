import { State } from 'zustand';
import { SetRecord, UseImmerStore } from '../types';

export const generateStateActions = <T extends State>(
  store: UseImmerStore<T>,
  storeName: string
) => {
  const actions: SetRecord<T> = {} as any;

  Object.keys(store.getState()).forEach((key) => {
    actions[key] = (value: keyof T) => {
      const prevValue = store.getState()[key];
      if (prevValue === value) return;

      const actionKey = key.replace(/^\S/, s => s.toUpperCase());
      store.setState(((draft) => {
        draft[key] = value;
      }), `${storeName}/${actionKey}`);
    };
  });

  return actions;
};
