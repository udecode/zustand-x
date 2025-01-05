import { StoreMutatorIdentifier } from 'zustand';

import { TState, TStateApi, TStateApiForBuilder } from '../types';
import { extendActions } from './extendActions';
import { extendSelectors } from './extendSelectors';

export const storeFactory = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = [],
>(
  api: TStateApiForBuilder<StateType, Mutators>
): TStateApi<StateType, Mutators> => {
  return {
    ...api,
    extendSelectors: (builder) => storeFactory(extendSelectors(builder, api)),
    extendActions: (builder) => storeFactory(extendActions(builder, api)),
  } as TStateApi<StateType, Mutators>;
};
