import {
  devToolsMiddleware,
  immerMiddleware,
  persistMiddleware,
} from '../middlewares';
import { mutativeMiddleware } from '../middlewares/mutative';
import { TFlattenMiddlewares, TMiddleware } from './middleware';
import { TBaseStoreOptions } from './options';
import { RemoveNever, TState } from './utils';

type ConditionalMiddleware<
  T,
  Middleware extends TMiddleware,
  IsDefault extends boolean = false,
> = T extends
  | {
      enabled: true;
    }
  | true
  ? Middleware
  : IsDefault extends true
    ? T extends
        | {
            enabled: false;
          }
        | false
      ? never
      : Middleware
    : never;

export type DefaultMutators<
  StateType extends TState,
  CreateStoreOptions extends TBaseStoreOptions<StateType>,
> = RemoveNever<
  TFlattenMiddlewares<
    [
      ConditionalMiddleware<
        CreateStoreOptions['devtools'],
        typeof devToolsMiddleware
      >,
      ConditionalMiddleware<
        CreateStoreOptions['persist'],
        typeof persistMiddleware<StateType>
      >,
      ConditionalMiddleware<
        CreateStoreOptions['immer'],
        typeof immerMiddleware
      >,
      ConditionalMiddleware<
        CreateStoreOptions['mutative'],
        typeof mutativeMiddleware
      >,
    ]
  >
>;
