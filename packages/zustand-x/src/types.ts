import { Mutate, StateCreator, StoreApi } from 'zustand';

export type TEqualityChecker<StateType> = (
  state: StateType,
  newState: StateType
) => boolean;
export type TGetSelectorRecord<O> = {
  [K in keyof O]: () => O[K];
};
export type TGetRecord<O> = {
  [K in keyof O]: (equalityFn?: TEqualityChecker<O[K]>) => O[K];
};
export type TSetRecord<O> = {
  [K in keyof O]: (value: O[K]) => void;
};
export type TStoreSelectorType<StateType, FilteredStateType = unknown> = (
  state: StateType
) => FilteredStateType;

export type TEnabledMiddlewares<MutatedStateType> = [
  ['zustand/devtools', never],
  ['zustand/persist', MutatedStateType],
];

export type TStoreMiddlewareCreatorType<
  StateType,
  MutatedStateType = StateType,
> = StateCreator<StateType, [], [...TEnabledMiddlewares<MutatedStateType>]>;
export type TCreatedStoreType<StateType, MutatedStateType = StateType> = Mutate<
  StoreApi<StateType>,
  TEnabledMiddlewares<MutatedStateType>
>;

export type TReadonlyStoreApi<StateType> = Pick<
  StoreApi<StateType>,
  'getState' | 'getInitialState' | 'subscribe'
>;

export type TStoreApiSet<StateType, TActions = {}> = TSetRecord<StateType> &
  TActions & {
    state: TCreatedStoreType<StateType>['setState'];
  };

export type TStoreApiGet<
  StateType,
  TSelectors = {},
> = TGetSelectorRecord<StateType> &
  TSelectors & {
    state: TCreatedStoreType<StateType>['getState'];
  };

export type TExtractState<S> = S extends {
  getState: () => infer StateType;
}
  ? StateType
  : never;

export type TStateApi<TName, StateType, TActions = {}, TSelectors = {}> = {
  name: TName;
  getInitialState: TCreatedStoreType<StateType>['getInitialState'];
  get: TStoreApiGet<StateType, TSelectors>;
  set: TStoreApiSet<StateType, TActions>;
  store: TCreatedStoreType<StateType>;
  useStore: <FilteredStateType>(
    selector: TStoreSelectorType<StateType, FilteredStateType>,
    equalityFn?: TEqualityChecker<FilteredStateType>
  ) => FilteredStateType;
  use: TGetRecord<StateType> & TSelectors;
  useTracked: TGetSelectorRecord<StateType> & TSelectors;
  useTrackedStore: () => StateType;
  extendSelectors<
    SelectorBuilder extends TSelectorBuilder<
      TName,
      StateType,
      TActions,
      TSelectors
    >,
  >(
    builder: SelectorBuilder
  ): TStateApi<
    TName,
    StateType,
    TStoreApiSet<StateType, TActions>,
    TSelectors & ReturnType<SelectorBuilder>
  >;
  extendActions<
    ActionBuilder extends TActionBuilder<
      TName,
      StateType,
      TActions,
      TSelectors
    >,
  >(
    builder: ActionBuilder
  ): TStateApi<
    TName,
    StateType,
    TActions & ReturnType<ActionBuilder>,
    TStoreApiGet<StateType, TSelectors>
  >;
};

export type TSelectorBuilder<
  TName,
  StateType,
  TActions = {},
  TSelectors = {},
> = (
  state: StateType,
  get: TStoreApiGet<StateType, TSelectors>,
  api: TStateApi<TName, StateType, TActions, TSelectors>
) => any;

export type TActionBuilder<TName, StateType, TActions = {}, TSelectors = {}> = (
  set: TStoreApiSet<StateType, TActions>,
  get: TStoreApiGet<StateType, TSelectors>,
  api: TStateApi<TName, StateType, TActions, TSelectors>
) => any;
