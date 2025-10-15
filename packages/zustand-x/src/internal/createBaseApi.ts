import { StoreMutatorIdentifier } from 'zustand';

import { TBaseStateApiForBuilder, TStoreApiGet } from '../types/baseStore';
import { TState } from '../types/utils';
import { TCreatedStoreMutateType } from '../types/utils';

import type {
  AnyFunction,
  TStoreApiSet,
  TStoreApiSubscribe,
} from '../types/baseStore';

export const createBaseApi = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction> = {},
  TSelectors extends Record<string, AnyFunction> = {},
>(
  store: TCreatedStoreMutateType<StateType, Mutators>,
  {
    name,
    isMutative,
  }: {
    name: string;
    isMutative: boolean;
  }
) => {
  const get: TStoreApiGet<StateType, Mutators, TSelectors> = ((key: string) => {
    if (key === 'state') {
      return store.getState();
    }

    return store.getState()[key as keyof StateType];
  }) as TStoreApiGet<StateType, Mutators, TSelectors>;

  const set: TStoreApiSet<StateType, Mutators, TActions> = ((
    key: string,
    value: any
  ) => {
    if (key === 'state') {
      return (store.setState as AnyFunction)(value);
    }

    const typedKey = key as keyof StateType;
    const prevValue = store.getState()[typedKey];

    if (typeof value === 'function') {
      value = value(prevValue);
    }
    if (prevValue === value) return;

    const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
    const debugLog = name ? `@@${name}/set${actionKey}` : undefined;

    (store.setState as AnyFunction)(
      isMutative
        ? (draft: StateType) => {
            draft[typedKey] = value;
          }
        : { [typedKey]: value },
      undefined,
      debugLog
    );
  }) as TStoreApiSet<StateType, Mutators, TActions>;

  const subscribe: TStoreApiSubscribe<StateType, Mutators, TSelectors> = ((
    key: string,
    selectorOrListener: AnyFunction,
    listener?: AnyFunction,
    options?: any
  ) => {
    if (key === 'state') {
      if (!listener) {
        return (store.subscribe as AnyFunction)(selectorOrListener);
      }

      return (store.subscribe as AnyFunction)(
        selectorOrListener,
        listener,
        options
      );
    }

    let wrappedSelector: AnyFunction;
    let wrappedListener: AnyFunction;
    let subscribeOptions: any;

    if (listener) {
      wrappedSelector = (state: StateType) =>
        selectorOrListener(state[key as keyof StateType]);
      wrappedListener = listener;
      subscribeOptions = options;
    } else {
      wrappedSelector = (state: StateType) => state[key as keyof StateType];
      wrappedListener = selectorOrListener;
      subscribeOptions = options;
    }

    return (store.subscribe as AnyFunction)(
      wrappedSelector,
      wrappedListener,
      subscribeOptions
    );
  }) as TStoreApiSubscribe<StateType, Mutators, TSelectors>;

  return {
    get,
    set,
    subscribe,
    store,
    name,
    actions: {} as TActions,
    selectors: {} as TSelectors,
  } as TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>;
};
