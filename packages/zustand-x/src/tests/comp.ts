import { StoreMutatorIdentifier } from 'zustand';

import { TFlattenMiddlewares, TMiddleware, TState } from '../types';
import { TuplifyUnion } from '../types/tuple';

// Define the createMiddleware function
const createMiddleware = <
  StateType extends TState,
  Middlewares extends TMiddleware<StateType> = TMiddleware<StateType>, // Accepts a tuple of middlewares
  MutatorTypes extends [
    StoreMutatorIdentifier,
    unknown,
  ][] = TFlattenMiddlewares<TuplifyUnion<Middlewares>>, // Infers mutator types
>({
  middlewares,
}: {
  middlewares: Middlewares[];
}) => {
  return middlewares as unknown as MutatorTypes;
};
