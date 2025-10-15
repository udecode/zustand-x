import type {
  AnyFunction,
  TBaseStateApiForBuilder,
  TSelectorBuilder,
} from '../types/baseStore';
import type { StoreMutatorIdentifier } from 'zustand';
import type { TState } from '../types/utils';

const identity = <T>(arg: T) => arg;

type ExtendSelectorOptions<StateType> = {
  selectWithStore?: <Result>(
    selector: (state: StateType) => Result,
    equalityFn?: (a: Result, b: Result) => boolean
  ) => Result;
};

export const extendSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TBaseStateApiForBuilder<StateType, Mutators, TActions, TSelectors>,
  options?: ExtendSelectorOptions<StateType>
) => {
  const baseGet = api.get.bind(api);
  const baseSubscribe = api.subscribe.bind(api);

  const newSelectors = builder(api);
  const selectors = {
    ...api.selectors,
    ...newSelectors,
  } as TSelectors & ReturnType<Builder>;

  const extendedApi = {
    ...api,
    selectors,
    get: ((key: string, ...args: unknown[]) => {
      if (key in selectors) {
        const selector = selectors[key];
        return selector(...args);
      }

      return baseGet(key as keyof StateType);
    }) as typeof api.get,
    subscribe: ((key: string, ...args: unknown[]) => {
      if (key in selectors) {
        const params = [...args];
        let optionsArg: any;
        let selectorArg: AnyFunction = identity;

        const maybeOptions = params.at(-1);
        if (typeof maybeOptions !== 'function') {
          optionsArg = params.pop();
        }

        const listener = params.pop() as AnyFunction;

        const maybeSelector = params.at(-1);
        if (typeof maybeSelector === 'function') {
          selectorArg = params.pop() as AnyFunction;
        }

        const selectorArgs = params;

        return baseSubscribe(
          'state',
          () =>
            selectorArg(
              selectors[key as keyof typeof selectors](
                ...selectorArgs
              )
            ),
          listener,
          optionsArg
        );
      }

      // @ts-expect-error -- passthrough to base subscribe
      return baseSubscribe(key, ...args);
    }) as typeof api.subscribe,
  } satisfies TBaseStateApiForBuilder<
    StateType,
    Mutators,
    TActions,
    Record<string, AnyFunction>
  >;

  if (options?.selectWithStore) {
    const selectWithStore = options.selectWithStore;
    (extendedApi as any).useValue = (
      key: string,
      ...args: unknown[]
    ) => {
      if (key in selectors) {
        const selector = selectors[key];
        const maybeEqualityFn = args.at(-1);
        const equalityFn =
          typeof maybeEqualityFn === 'function' ? maybeEqualityFn : undefined;
        const selectorArgs = equalityFn ? args.slice(0, -1) : args;

        return selectWithStore(
          () => selector(...selectorArgs),
          equalityFn as AnyFunction
        );
      }

      return (api as any).useValue?.(key, ...args);
    };
  }

  return extendedApi as TBaseStateApiForBuilder<
    StateType,
    Mutators,
    TActions,
    TSelectors & ReturnType<Builder>
  >;
};
