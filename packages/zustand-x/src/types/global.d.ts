import { StateCreator, StoreMutatorIdentifier } from 'zustand';

declare module 'zustand/middleware' {
  type Devtools = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  >(
    initializer: StateCreator<T, [...Mps, ['zustand/devtools', never]], Mcs>,
    devtoolsOptions?: DevtoolsOptions
  ) => StateCreator<T, Mps, [['zustand/devtools', never], ...Mcs]>;
  //@ts-ignore
  declare const devtools: Devtools;
}
