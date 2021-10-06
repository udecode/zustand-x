import { Draft } from 'immer';
import { State, StoreApi as RawStoreApi, UseStore } from 'zustand';
import { EqualityChecker, GetState, StateSelector } from 'zustand/vanilla';

export type StoreApiGet<
  T extends State = {},
  TSelectors = {}
> = StateGetters<T> & TSelectors;
export type StoreApiUse<T extends State = {}, TSelectors = {}> = GetRecord<T> &
  TSelectors;
export type StoreApiSet<TActions = {}> = TActions;

export type StoreApi<
  TName extends string,
  T extends State = {},
  TActions = {},
  TSelectors = {}
> = {
  get: StoreApiGet<T, TSelectors>;
  name: TName;
  set: StoreApiSet<TActions>;
  store: ImmerStoreApi<T>;
  use: StoreApiUse<T, TSelectors>;
  useStore: UseImmerStore<T>;

  extendSelectors<SB extends SelectorBuilder<TName, T, TActions, TSelectors>>(
    builder: SB
  ): StoreApi<
    TName,
    T,
    StateActions<T> & TActions,
    TSelectors & ReturnType<SB>
  >;

  extendActions<AB extends ActionBuilder<TName, T, StateActions<T> & TActions>>(
    builder: AB
  ): StoreApi<
    TName,
    T,
    StateActions<T> & TActions & ReturnType<AB>,
    TSelectors
  >;

  // extendActionsMerge<AB extends ActionBuilder<TName, T, StateActions<T> & TActions>>(
  //     builder: AB
  //   ): StoreApi<
  //     TName,
  //     T,
  //     StateActions<T> & TActions & ReturnType<AB>,
  //     TSelectors
  //   >;
};

export type MergeState<T extends State> = (state: Partial<T>) => void;

export type StateActions<T extends State> = SetRecord<T> & {
  state: SetImmerState<T>;
  mergeState: MergeState<T>;
};
export type StateGetters<T extends State> = GetRecord<T> & {
  state: GetState<T>;
};

export type SelectorRecord<T> = Record<string, (state: T) => any>;

export type SelectorBuilder<
  TName extends string,
  T extends State,
  TActions = {},
  TSelectors = {}
> = (
  state: T,
  get: StoreApiGet<T, TSelectors>,
  api: StoreApi<TName, T, TActions, TSelectors>
) => Record<string, (...args: any[]) => any>;

export type ActionBuilder<
  TName extends string,
  T extends State,
  TActions = {},
  TSelectors = {}
> = (
  set: StoreApiSet<TActions>,
  get: StoreApiGet<T, TSelectors>,
  api: StoreApi<TName, T, TActions, TSelectors>
) => any;

export type SetImmerState<T> = (fn: (draft: Draft<T>) => void) => void;

export interface ImmerStoreApi<T extends State>
  extends Omit<RawStoreApi<T>, 'setState'> {
  setState: SetImmerState<T>;
}

export interface UseImmerStore<T extends State>
  extends Omit<UseStore<T>, 'setState'> {
  (): T;

  <U>(selector: StateSelector<T, U>, equalityFn?: EqualityChecker<U>): U;

  setState: SetImmerState<T>;
}

export type GetRecord<O> = {
  [K in keyof O]: () => O[K];
};
export type SetRecord<O> = {
  [K in keyof O]: (value: O[K]) => void;
};

// export type UseRecord<O> = {
//   [K in keyof O as `use${Capitalize<string & K>}`]: () => O[K];
// };
// export type GetRecord<O> = {
//   [K in keyof O as `get${Capitalize<string & K>}`]: () => O[K];
// };
// export type SetRecord<O> = {
//   [K in keyof O as `set${Capitalize<string & K>}`]: (value: O[K]) => void;
// };
