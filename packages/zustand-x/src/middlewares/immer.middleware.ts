import { produce } from 'immer';
import { StoreApi } from 'zustand';

import { SetImmerState, State, StateCreatorWithDevtools } from '../types';

export const immerMiddleware =
  <T extends State>(
    config: StateCreatorWithDevtools<
      T,
      SetImmerState<T>,
      StoreApi<T>['getState']
    >
  ): StateCreatorWithDevtools<T> =>
  (set, get, api) => {
    const setState: SetImmerState<T> = (fn, actionName) =>
      set(produce<T>(fn), true, actionName);
    api.setState = setState as any;

    return config(setState, get, api);
  };
