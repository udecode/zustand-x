import { State } from 'zustand';
import { SetRecord, UseImmerStore } from '../types';

export const generateStateActions = <T extends State>(
  store: UseImmerStore<T>
) => {
  const actions: SetRecord<T> = {} as any;

  Object.keys(store.getState()).forEach((key) => {
    actions[key] = (value: keyof T) => {
      const prevValue = store.getState()[key];
      if (prevValue === value) return;

      store.setState((draft) => {
        draft[key] = value;
      });
    };
  });

  return actions;
};
