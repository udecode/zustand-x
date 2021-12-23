import produce from 'immer';
import { GetState, State, StateCreator } from 'zustand';
import { SetImmerState } from '../types';

export const immerMiddleware =
  <T extends State>(
    config: StateCreator<T, SetImmerState<T>, GetState<T>>
  ): StateCreator<T> =>
  (set, get, api) => {
    const setState: SetImmerState<T> = (fn) => set(produce<T>(fn), true);
    api.setState = setState as any;

    return config(setState, get, api);
  };
