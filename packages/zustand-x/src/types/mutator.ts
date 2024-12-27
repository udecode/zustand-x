import { StoreMutatorIdentifier } from 'zustand';

import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from '../middlewares';
import { TFlattenMiddlewares } from './middleware';
import { TBaseStoreOptions } from './options';
import { TState } from './utils';

export type DefaultMutators<
  StateType extends TState,
  Options extends TBaseStoreOptions<StateType>,
> = TFlattenMiddlewares<
  [
    ...(Options['immer'] extends { enabled: true }
      ? [typeof immerMiddleware]
      : []),
    ...(Options['persist'] extends { enabled: true }
      ? [typeof persistMiddleware<StateType>]
      : []),
    ...(Options['devtools'] extends { enabled: true }
      ? [typeof devToolsMiddleware]
      : []),
  ]
>;

export type ResolveMutators<
  OptionMutators extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = [
  ...(OptionMutators extends [StoreMutatorIdentifier, unknown][]
    ? OptionMutators
    : []),
  ...(Mcs extends [StoreMutatorIdentifier, unknown][] ? Mcs : []),
];
