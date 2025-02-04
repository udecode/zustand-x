import { produce } from 'immer';

import type { AnyFunction, MiddlewareOption } from '../types';
import type { Draft } from 'immer';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

declare module 'zustand' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  interface StoreMutators<S, A> {
    ['zustand/immer-x']: WithImmer<S>;
  }
}

type Write<T, U> = Omit<T, keyof U> & U;
type SkipTwo<T> = T extends { length: 0 }
  ? []
  : T extends { length: 1 }
    ? []
    : T extends { length: 0 | 1 }
      ? []
      : T extends [unknown, unknown, ...infer A]
        ? A
        : T extends [unknown, unknown?, ...infer A]
          ? A
          : T extends [unknown?, unknown?, ...infer A]
            ? A
            : never;

type SetStateType<T extends unknown[]> = Exclude<T[0], AnyFunction>;

type WithImmer<S> = Write<S, StoreImmer<S>>;

type StoreImmer<S> = S extends {
  setState: infer SetState;
}
  ? SetState extends {
      (...a: infer A1): infer Sr1;
      (...a: infer A2): infer Sr2;
    }
    ? {
        // Ideally, we would want to infer the `nextStateOrUpdater` `T` type from the
        // `A1` type, but this is infeasible since it is an intersection with
        // a partial type.
        setState(
          nextStateOrUpdater:
            | SetStateType<A1>
            | Partial<SetStateType<A1>>
            | ((state: Draft<Partial<SetStateType<A1>>>) => void),
          shouldReplace?: true,
          ...a: SkipTwo<A1>
        ): Sr1;
        setState(
          nextStateOrUpdater:
            | SetStateType<A2>
            | ((state: Draft<Partial<SetStateType<A2>>>) => void),
          shouldReplace: false,
          ...a: SkipTwo<A2>
        ): Sr2;
      }
    : never
  : never;

type Options = {
  enableMapSet?: boolean;
  enabledAutoFreeze?: boolean;
};
type ImmerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  options?: Options
) => StateCreator<T, [], []>;

const immerImpl: ImmerImpl = (initializer) => (set, get, store) => {
  type T = ReturnType<typeof initializer>;

  store.setState = (updater, replace, ...a) => {
    const nextState = (
      typeof updater === 'function' ? produce(updater as any) : updater
    ) as ((s: T) => T) | T | Partial<T>;

    return set(
      nextState,
      typeof replace === 'boolean' ? (replace as any) : true,
      ...a
    );
  };

  return initializer(store.setState, get, store);
};

type Immer = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, [...Mps, ['zustand/immer-x', never]], Mcs>,
  options?: Options
) => StateCreator<T, Mps, [['zustand/immer-x', never], ...Mcs]>;
export const immerMiddleware = immerImpl as unknown as Immer;

export type ImmerOptions = MiddlewareOption<Options>;
