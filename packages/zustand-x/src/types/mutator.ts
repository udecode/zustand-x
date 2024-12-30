import { StoreMutatorIdentifier } from 'zustand';

import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from '../middlewares';
import { TFlattenMiddlewares, TMiddleware } from './middleware';
import { TBaseStoreOptions } from './options';
import { TName, TState } from './utils';

type ConditionalMiddleware<
  T,
  Middleware extends TMiddleware,
  IsDefault extends boolean = false,
> = T extends
  | {
      enabled: true;
    }
  | true
  ? [Middleware]
  : IsDefault extends true
    ? T extends
        | {
            enabled: false;
          }
        | false
      ? []
      : [Middleware]
    : [];

export type DefaultMutators<
  Name extends TName,
  StateType extends TState,
  CreateStoreOptions extends TBaseStoreOptions<StateType, Name>,
> = TFlattenMiddlewares<
  [
    ...ConditionalMiddleware<
      CreateStoreOptions['devtools'],
      typeof devToolsMiddleware
    >,
    ...ConditionalMiddleware<
      CreateStoreOptions['persist'],
      typeof persistMiddleware<StateType>
    >,
    ...ConditionalMiddleware<
      CreateStoreOptions['immer'],
      typeof immerMiddleware,
      true
    >,
  ]
>;

export type ResolveMutators<
  OptionMutators extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
> = [
  ...(OptionMutators extends [StoreMutatorIdentifier, unknown][]
    ? OptionMutators
    : []),
  ...(Mcs extends [StoreMutatorIdentifier, unknown][] ? Mcs : []),
  ...(Mps extends [StoreMutatorIdentifier, unknown][] ? Mps : []),
];
