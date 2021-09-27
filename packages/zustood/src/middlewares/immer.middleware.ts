import produce from 'immer';
import { State, StateCreator } from 'zustand';
import { SetImmerState } from '../types';

export const immerMiddleware =
  <T extends State>(
    config: StateCreator<T>
  ): StateCreator<T, SetImmerState<T>> =>
  (set, get, api) => {
    api.setState = (fn) => set(produce<T>(fn as any) as any);

    return config(api.setState, get, api);
  };

// export const immerMutable =
//   <T extends State>(
//     config: StateCreator<T, SetImmerState<T>>
//   ): StateCreator<T> =>
//   (set, get, api) =>
//     config(
//       (fn) => {
//         setAutoFreeze(false);
//         set(produce<T>(fn));
//         setAutoFreeze(true);
//       },
//       get,
//       api
//     );
