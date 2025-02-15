import { StoreMutatorIdentifier } from 'zustand';

import {
  AnyFunction,
  TEqualityChecker,
  TSelectorBuilder,
  TState,
  TStateApiForBuilder,
} from '../types';

const identity = <T>(arg: T) => arg;

export const extendSelectors = <
  StateType extends TState,
  Mutators extends [StoreMutatorIdentifier, unknown][],
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, AnyFunction>,
  Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>,
>(
  builder: Builder,
  api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>
) => {
  const newSelectors = builder(api);
  const selectors = {
    ...api.selectors,
    ...newSelectors,
  };

  return {
    ...api,
    get: <K extends keyof (StateType & TSelectors & { state: true })>(
      key: K,
      ...args: K extends keyof TSelectors ? Parameters<TSelectors[K]> : []
    ) => {
      if (key in selectors) {
        const selector = selectors[key as keyof typeof selectors];
        return selector(...args);
      }
      return api.get(key as keyof StateType);
    },
    subscribe: <K extends keyof (StateType & TSelectors & { state: true })>(
      key: keyof (StateType & TSelectors & { state: true }),
      ...args: [
        ...[K extends keyof TSelectors ? Parameters<TSelectors[K]> : []],
        selector: AnyFunction,
        listener: AnyFunction,
        options?: any,
      ]
    ) => {
      if (key in selectors) {
        // variants:
        //                     subscribe(key, ...args,  listener)
        //           subscribe(key, ...args, selector,  listener)
        // subscribe(key, ...args, selector, listener,  undefined)
        // subscribe(key, ...args, selector, listener,  options)
        let options: any;
        let selector: any;
        let listener: any;
        const lastArg1 = args.at(-1);
        const lastArg2 = args.at(-2); // May be undefined
        const lastArg3 = args.at(-3); // May be undefined
        let argsEndIdx = -1;

        if (typeof lastArg1 === 'function') {
          listener = lastArg1;
          selector = typeof lastArg2 === 'function' ? lastArg2 : identity;
          argsEndIdx = typeof lastArg2 === 'function' ? -2 : -1;
        } else {
          options = lastArg1;
          listener = lastArg2;
          selector = lastArg3;
          argsEndIdx = -3;
        }

        return api.subscribe(
          // The key `state` does not matter, as selectors are closures over the `api`
          'state',
          () =>
            selector(
              selectors[key as keyof typeof selectors](
                ...args.slice(0, argsEndIdx)
              )
            ),
          listener,
          options
        );
      }
      // @ts-expect-error -- don't know how to type this
      return api.subscribe(key, ...args);
    },
    selectors,
    useValue: <K extends keyof (StateType & TSelectors)>(
      key: K,
      ...args: K extends keyof TSelectors
        ? [
            ...Parameters<TSelectors[K]>,
            TEqualityChecker<ReturnType<TSelectors[K]>> | undefined,
          ]
        : [TEqualityChecker<StateType[keyof StateType]> | undefined]
    ) => {
      if (key in selectors) {
        const selector = selectors[key as keyof typeof selectors];
        const lastArg = args.at(-1);
        const equalityFn = typeof lastArg === 'function' ? lastArg : undefined;
        const selectorArgs = equalityFn ? args.slice(0, -1) : args;

        return api.useStore(() => selector(...selectorArgs), equalityFn as any);
      }
      return api.useValue(
        key as keyof StateType,
        args[0] as TEqualityChecker<StateType[keyof StateType]>
      );
    },
  };
};
