import { StoreMutatorIdentifier } from 'zustand';

import {
  AnyFunction,
  TActionBuilder,
  TBaseStateApi,
  TSelectorBuilder,
  TStoreApiGet,
  TStoreApiSet,
  TStoreApiSubscribe,
} from './baseStore';
import { TCreatedStoreType, TState } from './utils';

import type { TEqualityChecker } from './utils';

export type TStateApi<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
> = Omit<
  TBaseStateApi<StateType, Mutators, TActions, TSelectors>,
  'extendActions' | 'extendSelectors'
> & {
  store: TCreatedStoreType<StateType, Mutators>;
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

export type {
  AnyFunction,
  TActionBuilder,
  TSelectorBuilder,
  TStoreApiGet,
  TStoreApiSet,
  TStoreApiSubscribe,
} from './baseStore';
