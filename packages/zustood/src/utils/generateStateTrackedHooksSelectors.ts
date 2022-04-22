import { State } from 'zustand';
import { GetRecord, UseImmerStore } from '../types';

export const generateStateTrackedHooksSelectors = <T extends State>(
  store: UseImmerStore<T>,
  trackedStore: () => T
) => {
  const selectors: GetRecord<T> = {} as any;

  Object.keys(store.getState()).forEach((key) => {
    selectors[key] = () => {
      return trackedStore()[key as keyof T];
    };
  });

  return selectors;
};
