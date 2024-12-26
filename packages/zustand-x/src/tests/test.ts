import { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Helper type to extract mutator type from a middleware
type ExtractMutatorFromMiddleware<M> = M extends (
  initializer: StateCreator<any, [], any>
) => StateCreator<any, [], infer Mutators>
  ? Mutators extends [infer Mutator, ...infer Rest]
    ? Mutator
    : never
  : never;

// Recursive flattening for middleware tuples
type FlattenMiddlewares<Middlewares extends readonly any[]> = {
  [K in keyof Middlewares]: ExtractMutatorFromMiddleware<Middlewares[K]>;
};

// Define a type for any middleware, including immer
type AnyMiddleware = (
  initializer: StateCreator<any, any, any>
) => StateCreator<any, any, any>;

// Define the createMiddleware function
const createMiddleware = <
  Middlewares extends readonly AnyMiddleware[], // Accepts a tuple of middlewares
  MutatorTypes = FlattenMiddlewares<Middlewares>, // Infers mutator types
>({
  middlewares,
}: {
  middlewares: Middlewares;
}): Middlewares => {
  return middlewares;
};

// Test case
const a = createMiddleware({
  middlewares: [immer, devtools] as const, // Use `as const` to enforce tuple inference
});

// Inferred type of `a`:
type A = typeof a;
/*
Expected:
  const createMiddleware: <
    [typeof immer, typeof devtools],
    [["zustand/immer", never], ["zustand/devtools", never]]
  >({
    middlewares,
  }: {
    middlewares: [typeof immer, typeof devtools];
  }) => [typeof immer, typeof devtools];
*/
