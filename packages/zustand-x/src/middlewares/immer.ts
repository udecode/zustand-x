import { Draft, produce } from 'immer';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

import { MiddlewareOption } from '../types';

type Write<T, U> = Omit<T, keyof U> & U;

type SetStateType<T> = Partial<Exclude<T, (...args: any[]) => any>>;
type WithImmer<S> = Write<S, StoreImmer<S>>;

type SkipOne<T> = T extends {
  length: 0;
}
  ? []
  : T extends [unknown, ...infer A]
    ? A
    : T extends [unknown?, ...infer A]
      ? A
      : never;

type StoreImmer<S> = S extends {
  setState: infer SetState;
}
  ? SetState extends {
      (updater: infer A1, ...rest: infer R1): infer Sr1;
      (updater: infer A2, ...rest: infer R2): infer Sr2;
    }
    ? {
        setState(
          nextStateOrUpdater:
            | SetStateType<A1>
            | ((state: Draft<SetStateType<A1>>) => void),
          replace?: true,
          ...a: SkipOne<R1>
        ): Sr1;
        setState(
          nextStateOrUpdater:
            | SetStateType<A2>
            | ((state: Draft<SetStateType<A2>>) => void),
          replace: false,
          ...a: SkipOne<R2>
        ): Sr2;
      }
    : never
  : never;

declare module 'zustand/vanilla' {
  interface StoreMutators<S, A> {
    ['zustand/immer-x']: WithImmer<S>;
  }
}
type Immer = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, [...Mps, ['zustand/immer-x', never]], Mcs>
) => StateCreator<T, Mps, [['zustand/immer-x', never], ...Mcs]>;

export const immerMiddleware: Immer = (initializer) => (set, get, store) => {
  //@ts-ignore
  store.setState = (updater, replace, ...a) => {
    const nextState =
      typeof updater === 'function' ? produce(updater) : updater;
    //@ts-ignore
    return set(nextState, typeof replace === 'boolean' ? replace : true, ...a);
  };
  //@ts-ignore
  return initializer(store.setState, get, store);
};

export type ImmerOptions = MiddlewareOption<{
  enableMapSet?: boolean;
  enabledAutoFreeze?: boolean;
}>;

export { enableMapSet, setAutoFreeze } from 'immer';
