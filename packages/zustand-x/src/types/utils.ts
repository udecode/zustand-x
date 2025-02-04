import { Mutate, StoreApi, StoreMutatorIdentifier } from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type TState = object;

export type TEqualityChecker<StateType> = (
  state: StateType,
  newState: StateType
) => boolean;

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
