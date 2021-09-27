import { State } from 'zustand';
import { GetRecord, UseImmerStore } from '../types';

export const generateStateGetSelectors = <T extends State>(
  store: UseImmerStore<T>
) => {
  const selectors: GetRecord<T> = {} as any;

  Object.keys(store.getState()).forEach((key) => {
    // selectors[`get${capitalize(key)}`] = () => store.getState()[key as keyof T];
    selectors[key] = () => store.getState()[key as keyof T];
  });

  return selectors;
};
