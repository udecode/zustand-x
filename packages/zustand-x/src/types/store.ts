import { StoreMutatorIdentifier } from 'zustand';

import {
  TCreatedStoreMutateType,
  TCreatedStoreType,
  TGetStoreEqualityRecord,
  TGetStoreRecord,
  TSetStoreRecord,
  TState,
} from './utils';

export type TSelectorBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => Record<string, any>;

export type TActionBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = (
  set: TStoreApiSet<StateType, Mutators, TActions>,
  get: TStoreApiGet<StateType, Mutators, TSelectors>,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
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
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = {
  name: string;
  get: TStoreApiGet<StateType, Mutators, TSelectors>;
  set: TStoreApiSet<StateType, Mutators, TActions>;
  store: TCreatedStoreMutateType<StateType, Mutators>;
  useStore: TCreatedStoreType<StateType, Mutators>;
  use: TGetStoreEqualityRecord<StateType> & TSelectors;
  useTracked: TGetStoreRecord<StateType> & TSelectors;
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
    TStoreApiSet<StateType, Mutators, TActions>,
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
    TStoreApiGet<StateType, Mutators, TSelectors>
  >;
};

export type TStateApiForBuilder<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions = {},
  TSelectors = {},
> = Omit<
  TStateApi<StateType, Mutators, TActions, TSelectors>,
  'extendActions' | 'extendSelectors'
>;
