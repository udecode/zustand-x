import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type TName = string;
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
  [K in keyof O]: (value: O[K]) => void;
};
export type TUseStoreSelectorType<
  StateType extends TState,
  FilteredStateType = unknown,
> = (state: StateType) => FilteredStateType;

export type TStoreInitiatorType<
  StateType extends TState,
  Mps extends [StoreMutatorIdentifier, unknown][],
  Mutators extends [StoreMutatorIdentifier, unknown][],
  Modified = StateType,
> = StateCreator<StateType, Mps, Mutators, Modified>;

export type TCreatedStoreMutateType<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = Mutate<StoreApi<StateType>, Mutators>;

export type TCreatedStoreType<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = UseBoundStoreWithEqualityFn<TCreatedStoreMutateType<StateType, Mutators>>;

export type MiddlewareOption<T> = T & {
  enabled?: boolean;
};

export type ArrayElement<T> = T extends (infer E)[] ? E : never;

export type ArrayFilterNonNullable<T> = T extends [null | undefined | never]
  ? []
  : T;
