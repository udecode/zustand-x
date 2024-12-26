import { StoreMutatorIdentifier } from 'zustand';

import { TActionBuilder, TSelectorBuilder, TStateApi } from '../types';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

export const storeFactory = <
  TName,
  StateType,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
>(
  api: TStateApi<TName, StateType, Mutators>
) => {
  return {
    ...api,
    extendSelectors: (builder: TSelectorBuilder<TName, StateType, Mutators>) =>
      storeFactory(extendSelectors(builder, api)),
    extendActions: (builder: TActionBuilder<TName, StateType, Mutators>) =>
      storeFactory(extendActions(builder, api)),
  };
};
