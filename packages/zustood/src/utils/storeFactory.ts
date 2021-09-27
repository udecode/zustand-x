import { State } from 'zustand';
import {
  ActionBuilder,
  SelectorBuilder,
  StateActions,
  StoreApi,
} from '../types';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

export const storeFactory = <
  TName extends string,
  T extends State,
  TActions = {},
  TSelectors = {}
>(
  api: StoreApi<TName, T, StateActions<T> & TActions, TSelectors>
) => {
  return {
    ...api,
    extendSelectors: (
      builder: SelectorBuilder<TName, T, TActions, TSelectors>
    ) => storeFactory(extendSelectors(builder, api)),
    extendActions: (
      builder: ActionBuilder<TName, T, StateActions<T> & TActions, TSelectors>
    ) => storeFactory(extendActions(builder, api)),
  };
};
