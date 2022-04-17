import produce from 'immer';
import { GetState, State } from 'zustand';
import { SetImmerState, StateCreatorWithDevtools } from '../types';

export const immerMiddleware =
  <T extends State>(
    config: StateCreatorWithDevtools<T, SetImmerState<T>, GetState<T>>
  ): StateCreatorWithDevtools<T> =>
  (set, get, api) => {
    const setState: SetImmerState<T> = (fn, name) => set(produce<T>(fn), true, name);
    api.setState = setState as any;

    return config(setState, get, api);
  };
