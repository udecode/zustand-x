import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

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
export type TUseStoreSelectorType<StateType, FilteredStateType = unknown> = (
  state: StateType
) => FilteredStateType;

export type TStoreInitiatorType<
  StateType,
  Mps extends [StoreMutatorIdentifier, unknown][],
  Mutators extends [StoreMutatorIdentifier, unknown][],
  Modified = StateType,
> = StateCreator<StateType, Mps, Mutators, Modified>;

export type TCreatedStoreType<
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = UseBoundStoreWithEqualityFn<Mutate<StoreApi<StateType>, Mutators>>;

export type MiddlewareOption<T> = T & {
  enabled?: boolean;
};
