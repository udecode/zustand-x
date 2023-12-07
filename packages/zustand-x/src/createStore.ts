import { setAutoFreeze, enableMapSet } from 'immer';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import {
  devtools as devtoolsMiddleware,
  persist as persistMiddleware,
} from 'zustand/middleware';
import { createStore as createVanillaStore } from 'zustand/vanilla';
import {
  ImmerStoreApi,
  MergeState,
  SetImmerState,
  StateActions,
  StateGetters,
  StoreApi,
  UseImmerStore,
  State,
} from './types';
import { generateStateActions } from './utils/generateStateActions';
import { storeFactory } from './utils/storeFactory';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
import { generateStateTrackedHooksSelectors } from './utils/generateStateTrackedHooksSelectors';
import { immerMiddleware } from './middlewares/immer.middleware';
import { pipe } from './utils/pipe';
import { CreateStoreOptions } from './types/CreateStoreOptions';

export const createStore =
  <TName extends string>(name: TName) =>
  <T extends State>(
    initialState: T,
    options: CreateStoreOptions<T> = {}
  ): StoreApi<TName, T, StateActions<T>> => {
    const {
      middlewares: _middlewares = [],
      devtools,
      persist,
      immer,
    } = options;

    setAutoFreeze(immer?.enabledAutoFreeze ?? false);
    if (immer?.enableMapSet) {
      enableMapSet();
    }

    const middlewares: any[] = [immerMiddleware, ..._middlewares];

    if (persist?.enabled) {
      const options = {
        ...persist,
        name: persist.name ?? name,
      };

      middlewares.push((config: any) =>
        persistMiddleware(config, options as any)
      );
    }

    if (devtools?.enabled) {
      middlewares.push((config: any) =>
        devtoolsMiddleware(config, { ...devtools, name })
      );
    }

    middlewares.push(createVanillaStore);

    // @ts-ignore
    const createStore = (createState: StateCreator<T, SetImmerState<T>>) =>
      pipe(createState as any, ...middlewares) as ImmerStoreApi<T>;

    const store = createStore(() => initialState);
    const useStore = create(store as any) as UseImmerStore<T>;

    const stateActions = generateStateActions(useStore, name);

    const mergeState: MergeState<T> = (state, actionName) => {
      store.setState((draft) => {
        Object.assign(draft, state);
      }, actionName || `@@${name}/mergeState`);
    };

    const setState: SetImmerState<T> = (fn, actionName) => {
      store.setState(fn, actionName || `@@${name}/setState`);
    };

    const hookSelectors = generateStateHookSelectors(useStore);
    const getterSelectors = generateStateGetSelectors(useStore);

    const useTrackedStore = createTrackedSelector(useStore);
    const trackedHooksSelectors = generateStateTrackedHooksSelectors(
      useStore,
      useTrackedStore
    );

    const api = {
      get: {
        state: store.getState,
        ...getterSelectors,
      } as StateGetters<T>,
      name,
      set: {
        state: setState,
        mergeState,
        ...stateActions,
      } as StateActions<T>,
      store,
      use: hookSelectors,
      useTracked: trackedHooksSelectors,
      useStore,
      useTrackedStore,
      extendSelectors: () => api as any,
      extendActions: () => api as any,
    };

    return storeFactory(api) as StoreApi<TName, T, StateActions<T>>;
  };
