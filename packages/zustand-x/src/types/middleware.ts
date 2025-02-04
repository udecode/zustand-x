import { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Helper type to extract mutator type from a middleware
export type TExtractMutatorFromMiddleware<M> = M extends (
  initializer: StateCreator<any, any, any, any>,
  ...rest: any[]
) => StateCreator<any, any, infer Mutators, any>
  ? // eslint-disable-next-line unused-imports/no-unused-vars
    Mutators extends [infer Mutator, ...infer Rest]
    ? Mutator extends [StoreMutatorIdentifier, unknown]
      ? Mutator
      : never
    : never
  : never;

// Recursive flattening for middleware tuples
export type TFlattenMiddlewares<Middlewares extends TMiddleware[]> = {
  [K in keyof Middlewares]: TExtractMutatorFromMiddleware<Middlewares[K]>;
};

export type TMiddleware = (
  initializer: StateCreator<any, any, any>,
  ...rest: any[]
) => StateCreator<any, any, any>;
