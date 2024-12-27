import { StateCreator, StoreMutatorIdentifier } from 'zustand';

import { ArrayFilterNonNullable, TState } from './utils';

// Helper type to extract mutator type from a middleware
export type TExtractMutatorFromMiddleware<M> = M extends (
  initializer: StateCreator<any, any, any, any>,
  ...rest: any[]
) => StateCreator<any, any, infer Mutators, any>
  ? Mutators extends [infer Mutator, ...infer Rest]
    ? Mutator extends [StoreMutatorIdentifier, unknown]
      ? Mutator
      : never
    : never
  : never;

// Recursive flattening for middleware tuples
export type TFlattenMiddlewaresRecursive<Middlewares extends readonly any[]> = {
  [K in keyof Middlewares]: TExtractMutatorFromMiddleware<Middlewares[K]>;
};

export type TFlattenMiddlewares<Middlewares extends readonly any[]> =
  ArrayFilterNonNullable<TFlattenMiddlewaresRecursive<Middlewares>>;

export type TMiddleware<
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
> = (
  initializer: StateCreator<StateType, any, Mutators>
) => StateCreator<any, any, any>;
