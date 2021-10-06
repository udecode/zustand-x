import { setAutoFreeze } from 'immer';
import create, { State, StateCreator } from 'zustand';
import {
  devtools as devtoolsMiddleware,
  persist as persistMiddleware,
} from 'zustand/middleware';
import createVanillaStore from 'zustand/vanilla';
import {
  ImmerStoreApi,
  MergeState,
  SetImmerState,
  StateActions,
  StateGetters,
  StoreApi,
  UseImmerStore,
} from './types';
import { generateStateActions } from './utils/generateStateActions';
import { storeFactory } from './utils/storeFactory';
import { generateStateGetSelectors } from './utils/generateStateGetSelectors';
import { generateStateHookSelectors } from './utils/generateStateHookSelectors';
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
      enableAutoFreeze = false,
    } = options;

    setAutoFreeze(enableAutoFreeze);
    const middlewares: any[] = [immerMiddleware, ..._middlewares];

    if (persist?.enabled) {
      middlewares.push((config: any) =>
        persistMiddleware(config, { ...persist, name } as any)
      );
    }

    if (devtools?.enabled) {
      middlewares.push((config: any) =>
        devtoolsMiddleware(config, { ...devtools, name })
      );
    }

    middlewares.push(createVanillaStore);

    const createStore = (createState: StateCreator<T, SetImmerState<T>>) =>
      pipe(createState as any, ...middlewares) as ImmerStoreApi<T>;

    const store = createStore(() => initialState);
    const useStore = create(store as any) as UseImmerStore<T>;

    const stateActions = generateStateActions(useStore);

    const mergeState: MergeState<T> = (state) => {
      store.setState((draft) => {
        Object.assign(draft, state);
      });
    };

    const hookSelectors = generateStateHookSelectors(useStore);
    const getterSelectors = generateStateGetSelectors(useStore);

    const api = {
      get: {
        state: store.getState,
        ...getterSelectors,
      } as StateGetters<T>,
      name,
      set: {
        state: store.setState,
        mergeState,
        ...stateActions,
      } as StateActions<T>,
      store,
      use: hookSelectors,
      useStore,
      extendSelectors: () => api as any,
      extendActions: () => api as any,
    };

    return storeFactory(api) as StoreApi<TName, T, StateActions<T>>;
  };
