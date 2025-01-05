import { create, PatchesOptions } from 'mutative';

import type { MiddlewareOption } from '../types';
import type { Options as _MutativeOptions, Draft } from 'mutative';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

declare module 'zustand/vanilla' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StoreMutators<S, A> {
    ['zustand/mutative-x']: WithMutative<S>;
  }
}

type SetStateType<T extends unknown[]> = Exclude<T[0], (...args: any[]) => any>;
type WithMutative<S> = Write<S, StoreMutative<S>>;

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
type StoreMutative<S> = S extends {
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

type Options<O extends PatchesOptions, F extends boolean> = Omit<
  _MutativeOptions<O, F>,
  'enablePatches'
>;
type MutativeImpl = <T, F extends boolean = false>(
  storeInitializer: StateCreator<T, [], []>,
  options?: Options<false, F>
) => StateCreator<T, [], []>;

const mutativeImpl: MutativeImpl =
  (initializer, options) => (set, get, store) => {
    type T = ReturnType<typeof initializer>;

    store.setState = (updater, replace, ...a) => {
      const nextState = (
        typeof updater === 'function'
          ? create(
              updater as any,
              options ? { ...options, enablePatches: false } : options
            )
          : updater
      ) as ((s: T) => T) | T | Partial<T>;

      return set(
        nextState as any,
        typeof replace === 'boolean' ? (replace as any) : true,
        ...a
      );
    };

    return initializer(store.setState, get, store);
  };

type Mutative = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  F extends boolean = false,
>(
  initializer: StateCreator<T, [...Mps, ['zustand/mutative-x', never]], Mcs>,
  options?: Options<false, F>
) => StateCreator<T, Mps, [['zustand/mutative-x', never], ...Mcs]>;

export const mutativeMiddleware = mutativeImpl as unknown as Mutative;
export type MutativeOptions<F extends boolean = false> = MiddlewareOption<
  Options<false, F>
>;
