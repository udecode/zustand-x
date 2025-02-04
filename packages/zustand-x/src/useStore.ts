import type { AnyFunction, TEqualityChecker, TState, TStateApi } from './types';
import type { StoreMutatorIdentifier } from 'zustand';

export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof StateType = keyof StateType,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K
): StateType[K];
export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof TSelectors = keyof TSelectors,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K,
  ...args: Parameters<TSelectors[K]>
): ReturnType<TSelectors[K]>;
export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: 'state'
): StateType;
export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof StateType = keyof StateType,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K,
  equalityFn?: TEqualityChecker<StateType[K]>
): StateType[K];
export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof TSelectors = keyof TSelectors,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K,
  ...args: [
    ...Parameters<TSelectors[K]>,
    TEqualityChecker<ReturnType<TSelectors[K]>>?,
  ]
): ReturnType<TSelectors[K]>;
export function useStoreValue<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof StateType | keyof TSelectors =
    | keyof StateType
    | keyof TSelectors,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K,
  ...args: unknown[]
) {
  return store.useValue(key as any, ...(args as any));
}

export function useStoreState<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof StateType = keyof StateType,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K,
  equalityFn?: TEqualityChecker<StateType[K]>
): [StateType[K], (value: StateType[K]) => void] {
  return store.useState(key, equalityFn);
}

export function useTrackedStore<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(store: TStateApi<StateType, Mutators, TActions, TSelectors>): StateType {
  return store.useTrackedStore();
}

export function useTracked<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
  K extends keyof StateType = keyof StateType,
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>,
  key: K
): StateType[K] {
  return store.useTracked(key);
}

/**
 * Get the underlying Zustand store hook.
 * @example
 * const name = useZustandStore(store, (state) => state.name)
 */
export const useZustandStore = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  store: TStateApi<StateType, Mutators, TActions, TSelectors>
) => {
  return store.useStore;
};
