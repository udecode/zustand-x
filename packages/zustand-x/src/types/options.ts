import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';
import { TName, TState } from './utils';

export type TBaseStoreOptions<StateType extends TState, Name extends TName> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
  name: Name;
};
