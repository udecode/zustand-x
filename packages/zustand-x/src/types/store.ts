import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TGetStoreEqualityRecord,
  TGetStoreRecord,
  TName,
  TSetStoreRecord,
  TState,
} from './utils';

export type TSelectorBuilder<
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApi<Name, StateType, Mutators, TActions, TSelectors>
) => Record<string, any>;

export type TActionBuilder<
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApi<Name, StateType, Mutators, TActions, TSelectors>
) => Record<string, any>;

export type TStoreApiGet<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TSelectors = {},
> = TGetStoreRecord<StateType> &
  TSelectors & {
    state: TCreatedStoreType<StateType, Mutators>['getState'];
  };

export type TStoreApiSet<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
> = TSetStoreRecord<StateType> &
  TActions & {
    state: TCreatedStoreType<StateType, Mutators>['setState'];
  };

export type TStateApi<
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = {
  name: Name;
  getInitialState: TCreatedStoreType<StateType, Mutators>['getInitialState'];
  get: TStoreApiGet<StateType, Mutators, TSelectors>;
  set: TStoreApiSet<StateType, Mutators, TActions>;
  store: TCreatedStoreType<StateType, Mutators>;
  useStore: TCreatedStoreType<StateType, Mutators>;
  use: TGetStoreEqualityRecord<StateType> & TSelectors;
  useTracked: TGetStoreRecord<StateType> & TSelectors;
  useTrackedStore: () => StateType;
  extendSelectors<
    SelectorBuilder extends TSelectorBuilder<
      Name,
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: SelectorBuilder
  ): TStateApi<
    Name,
    StateType,
    Mutators,
    TStoreApiSet<StateType, Mutators, TActions>,
    TSelectors & ReturnType<SelectorBuilder>
  >;
  extendActions<
    ActionBuilder extends TActionBuilder<
      Name,
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: ActionBuilder
  ): TStateApi<
    Name,
    StateType,
    Mutators,
    TActions & ReturnType<ActionBuilder>,
    TStoreApiGet<StateType, Mutators, TSelectors>
  >;
};
