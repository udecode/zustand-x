import { State } from 'zustand';
import {
  SelectorBuilder,
  StateActions,
  StoreApi,
  StoreApiGet,
  StoreApiUse,
  StoreApiUseTracked,
} from '../types';

export const extendSelectors = <
  CB extends SelectorBuilder<TName, T, TActions, TSelectors>,
  TName extends string,
  T extends State = {},
  TActions = {},
  TSelectors = {}
>(
  builder: CB,
  api: StoreApi<TName, T, StateActions<T> & TActions, TSelectors>
): StoreApi<
  TName,
  T,
  StateActions<T> & TActions,
  TSelectors & ReturnType<CB>
> => {
  const use = {
    ...api.use,
  } as StoreApiUse<T, TSelectors & ReturnType<CB>>;

  const useTracked = {
    ...api.useTracked,
  } as StoreApiUseTracked<T, TSelectors & ReturnType<CB>>;

  const get = {
    ...api.get,
  } as StoreApiGet<T, TSelectors & ReturnType<CB>>;

  Object.keys(builder(api.store.getState(), api.get, api)).forEach((key) => {
    // @ts-ignore
    use[key] = (...args: any[]) =>
      api.useStore((state) => {
        const selectors = builder(state, api.get, api);
        const selector = selectors[key];
        return selector(...args);
      });
    // @ts-ignore
    useTracked[key] = (...args: any[]) => {
      const trackedState = api.useTrackedStore();
      const selectors = builder(trackedState, api.get, api);
      const selector = selectors[key];
      return selector(...args);
    };
    // @ts-ignore
    get[key] = (...args: any[]) => {
      const selectors = builder(api.store.getState(), api.get, api);
      const selector = selectors[key];
      return selector(...args);
    };
  });

  return {
    ...(api as any),
    get,
    use,
    useTracked,
  };
};
