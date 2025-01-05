import { Mutate, StoreApi, StoreMutatorIdentifier } from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type TState = object;

export type TEqualityChecker<StateType> = (
  state: StateType,
  newState: StateType
) => boolean;

export type TGetStoreRecord<O> = {
  [K in keyof O]: () => O[K];
};
export type TGetStoreEqualityRecord<O> = {
  [K in keyof O]: (equalityFn?: TEqualityChecker<O[K]>) => O[K];
};
export type TSetStoreRecord<O> = {
  [K in keyof O]: (value: O[K], mutative?: boolean) => void;
};
export type TUseStoreSelectorType<
  StateType extends TState,
  FilteredStateType = unknown,
> = (state: StateType) => FilteredStateType;

export type TCreatedStoreMutateType<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = Mutate<StoreApi<StateType>, Mutators>;

export type TCreatedStoreType<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = UseBoundStoreWithEqualityFn<TCreatedStoreMutateType<StateType, Mutators>>;

export type MiddlewareOption<T> =
  | boolean
  | (T & {
      enabled?: boolean;
    });

export type ArrayElement<T> = T extends (infer E)[] ? E : never;

export type RemoveNever<T> = T extends [infer First, ...infer Rest]
  ? [First] extends [never]
    ? RemoveNever<Rest>
    : [First, ...RemoveNever<Rest>]
  : [];
