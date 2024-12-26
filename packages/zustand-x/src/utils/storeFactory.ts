import { StoreMutatorIdentifier } from 'zustand';

import {
  TActionBuilder,
  TName,
  TSelectorBuilder,
  TState,
  TStateApi,
} from '../types';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

export const storeFactory = <
  Name extends TName,
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
>(
  api: TStateApi<Name, StateType, Mutators>
) => {
  return {
    ...api,
    extendSelectors: (builder: TSelectorBuilder<Name, StateType, Mutators>) =>
      storeFactory(extendSelectors(builder, api)),
    extendActions: (builder: TActionBuilder<Name, StateType, Mutators>) =>
      storeFactory(extendActions(builder, api)),
  };
};
