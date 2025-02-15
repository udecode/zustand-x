import { StoreMutatorIdentifier } from 'zustand';

import { TCreatedStoreMutateType, TCreatedStoreType, TState } from './utils';

import type { TEqualityChecker } from './utils';

export type AnyFunction = (...args: any[]) => any;

export type TSelectorBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
> = (
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => Record<string, AnyFunction>;

export type TActionBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
> = (
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => Record<string, AnyFunction>;

export type TStoreApiGet<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TSelectors extends Record<string, AnyFunction> = {},
> = {
  <K extends keyof StateType>(key: K): StateType[K];
  <K extends keyof TSelectors>(
    key: K,
    ...args: Parameters<TSelectors[K]>
  ): ReturnType<TSelectors[K]>;
  (
    key: 'state'
  ): ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>;
};

export type TStoreApiSet<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
> = {
  <K extends keyof StateType>(key: K, value: StateType[K]): void;
  <K extends keyof TActions>(
    key: K,
    ...args: Parameters<TActions[K]>
  ): ReturnType<TActions[K]>;
  (
    key: 'state',
    value: Parameters<TCreatedStoreType<StateType, Mutators>['setState']>[0]
  ): void;
};

export type TStoreApiSubscribe<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TSelectors extends Record<string, AnyFunction> = {},
> = {
  <K extends keyof StateType>(
    key: K,
    listener: (state: StateType[K], previousState: StateType[K]) => void
  ): () => void;
  <K extends keyof StateType, S = StateType[K]>(
    key: K,
    selector: (state: StateType[K]) => S,
    listener: (state: S, previousState: S) => void,
    options?: { equalityFn?: TEqualityChecker<S>; fireImmediately?: boolean }
  ): () => void;
  <K extends keyof TSelectors>(
    key: K,
    ...args: [
      ...Parameters<TSelectors[K]>,
      listener: (
        state: ReturnType<TSelectors[K]>,
        previousState: ReturnType<TSelectors[K]>
      ) => void,
    ]
  ): () => void;
  <K extends keyof TSelectors, S = ReturnType<TSelectors[K]>>(
    key: K,
    ...args: [
      ...Parameters<TSelectors[K]>,
      selector: (state: ReturnType<TSelectors[K]>) => S,
      listener: (state: S, previousState: S) => void,
      options?: { equalityFn?: TEqualityChecker<S>; fireImmediately?: boolean },
    ]
  ): () => void;
  (
    key: 'state',
    listener: (
      state: ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>,
      previousState: ReturnType<
        TCreatedStoreType<StateType, Mutators>['getState']
      >
    ) => void
  ): () => void;
  <S = ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>>(
    key: 'state',
    selector: (
      state: ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>
    ) => S,
    listener: (state: S, previousState: S) => void,
    options?: { equalityFn?: TEqualityChecker<S>; fireImmediately?: boolean }
  ): () => void;
};

export type TStateApi<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
> = {
  name: string;
  get: TStoreApiGet<StateType, Mutators, TSelectors>;
  set: TStoreApiSet<StateType, Mutators, TActions>;
  subscribe: TStoreApiSubscribe<StateType, Mutators, TSelectors>;
  actions: TActions;
  selectors: TSelectors;
  store: TCreatedStoreMutateType<StateType, Mutators>;
  useStore: TCreatedStoreType<StateType, Mutators>;
  useValue: {
    <K extends keyof StateType>(key: K): StateType[K];
    <K extends keyof TSelectors>(
      key: K,
      ...args: Parameters<TSelectors[K]>
    ): ReturnType<TSelectors[K]>;
    (
      key: 'state'
    ): ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>;
    <K extends keyof StateType>(
      key: K,
      equalityFn?: TEqualityChecker<StateType[K]>
    ): StateType[K];
    <K extends keyof TSelectors>(
      key: K,
      ...args: [
        ...Parameters<TSelectors[K]>,
        TEqualityChecker<ReturnType<TSelectors[K]>>?,
      ]
    ): ReturnType<TSelectors[K]>;
  };
  useState: {
    <K extends keyof StateType>(
      key: K,
      equalityFn?: TEqualityChecker<StateType[K]>
    ): [StateType[K], (value: StateType[K]) => void];
  };
  useTracked: <K extends keyof StateType>(key: K) => StateType[K];
  useTrackedStore: () => StateType;
  extendSelectors<
    SelectorBuilder extends TSelectorBuilder<
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: SelectorBuilder
  ): TStateApi<
    StateType,
    Mutators,
    TActions,
    TSelectors & ReturnType<SelectorBuilder>
  >;
  extendActions<
    ActionBuilder extends TActionBuilder<
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: ActionBuilder
  ): TStateApi<
    StateType,
    Mutators,
    TActions & ReturnType<ActionBuilder>,
    TSelectors
  >;
};

export type TStateApiForBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
> = Omit<
  TStateApi<StateType, Mutators, TActions, TSelectors>,
  'extendActions' | 'extendSelectors'
>;
