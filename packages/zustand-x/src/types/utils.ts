import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand';

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
export type TStoreSelectorType<StateType, FilteredStateType = unknown> = (
  state: StateType
) => FilteredStateType;

export type TStoreMiddlewareStateCreatorType<
  StateType,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
> = StateCreator<StateType, Mps, [...Mutators]>;

export type TCreatedStoreType<
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
> = Mutate<StoreApi<StateType>, [...Mutators]>;

export type TReadonlyStoreApi<StateType> = Pick<
  StoreApi<StateType>,
  'getState' | 'getInitialState' | 'subscribe'
>;
