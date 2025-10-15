import { subscribeWithSelector } from 'zustand/middleware';

import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from '../middlewares';
import { mutativeMiddleware } from '../middlewares/mutative';
import { DefaultMutators, TBaseStoreOptions, TState } from '../types';
import { TMiddleware } from '../types/middleware';
import { getOptions } from '../utils/helpers';

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

type BuildStateCreatorResult<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = {
  stateCreator: StateCreator<StateType, [], Mutators>;
  isMutative: boolean;
  name: string;
};

export const buildStateCreator = <
  StateType extends TState,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  CreateStoreOptions extends
    TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>,
>(
  initializer: StateType | StateCreator<StateType, Mps, Mcs>,
  options: CreateStoreOptions
) => {
  type Mutators = [...DefaultMutators<StateType, CreateStoreOptions>, ...Mcs];
  const {
    name,
    devtools: devtoolsOptions,
    immer: immerOptions,
    mutative: mutativeOptions,
    persist: persistOptions,
    isMutativeState,
  } = options;

  const middlewares: TMiddleware[] = [];

  const devtoolsConfig = getOptions(devtoolsOptions);
  if (devtoolsConfig.enabled) {
    middlewares.push((config) =>
      devToolsMiddleware(config, {
        ...devtoolsConfig,
        name: devtoolsConfig?.name ?? name,
      })
    );
  }

  const persistConfig = getOptions(persistOptions);
  if (persistConfig.enabled) {
    middlewares.push((config) =>
      persistMiddleware(config, {
        ...persistConfig,
        name: persistConfig.name ?? name,
      })
    );
  }

  const immerConfig = getOptions(immerOptions);
  if (immerConfig.enabled) {
    middlewares.push((config) => immerMiddleware(config, immerConfig));
  }

  const mutativeConfig = getOptions(mutativeOptions);
  if (mutativeConfig.enabled) {
    middlewares.push((config) => mutativeMiddleware(config, mutativeConfig));
  }

  const stateCreator = middlewares
    .reverse()
    .reduce(
      (creator, middleware) => middleware(creator),
      (typeof initializer === 'function'
        ? initializer
        : () => initializer) as StateCreator<StateType>
    ) as StateCreator<StateType, [], Mutators>;

  const isMutative =
    isMutativeState || immerConfig.enabled || mutativeConfig.enabled;

  return {
    stateCreator: subscribeWithSelector(stateCreator),
    isMutative,
    name,
  } as BuildStateCreatorResult<StateType, Mutators>;
};
