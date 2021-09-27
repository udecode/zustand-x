import { State } from 'zustand';
import {
  SelectorBuilder,
  StateActions,
  StoreApi,
  StoreApiGet,
  StoreApiUse,
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

  const get = {
    ...api.get,
  } as StoreApiGet<T, TSelectors & ReturnType<CB>>;

  Object.keys(builder(api.store.getState(), api.get, api)).forEach((key) => {
    // @ts-ignore
    use[key] = (...args: any[]) =>
      api.useStore((state) => builder(state, api.get, api)[key])(...args);
    // @ts-ignore
    get[key] = (...args: any[]) =>
      builder(api.store.getState(), api.get, api)[key](...args);
  });

  return {
    ...(api as any),
    get,
    use,
  };
};
