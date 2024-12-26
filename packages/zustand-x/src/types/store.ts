import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreType,
  TGetStoreEqualityRecord,
  TGetStoreRecord,
  TSetStoreRecord,
} from './utils';

export type TSelectorBuilder<
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApi<TName, StateType, Mutators, TActions, TSelectors>
) => Record<string, any>;

export type TActionBuilder<
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApi<TName, StateType, Mutators, TActions, TSelectors>
) => Record<string, any>;

export type TStoreApiGet<
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TSelectors = {},
> = TGetStoreRecord<StateType> &
  TSelectors & {
    state: TCreatedStoreType<StateType, Mutators>['getState'];
  };

export type TStoreApiSet<
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
> = TSetStoreRecord<StateType> &
  TActions & {
    state: TCreatedStoreType<StateType, Mutators>['setState'];
  };

export type TStateApi<
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = {
  name: TName;
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
      TName,
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: SelectorBuilder
  ): TStateApi<
    TName,
    StateType,
    Mutators,
    TStoreApiSet<StateType, Mutators, TActions>,
    TSelectors & ReturnType<SelectorBuilder>
  >;
  extendActions<
    ActionBuilder extends TActionBuilder<
      TName,
      StateType,
      Mutators,
      TActions,
      TSelectors
    >,
  >(
    builder: ActionBuilder
  ): TStateApi<
    TName,
    StateType,
    Mutators,
    TActions & ReturnType<ActionBuilder>,
    TStoreApiGet<StateType, Mutators, TSelectors>
  >;
};
