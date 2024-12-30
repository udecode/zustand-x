import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';
import { TState } from './utils';

export type TBaseStoreOptions<StateType extends TState> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
};
