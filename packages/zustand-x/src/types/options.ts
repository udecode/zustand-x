import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';
import { MutativeOptions } from './../middlewares/mutative';
import { TName, TState } from './utils';

export type TBaseStoreOptions<StateType extends TState, Name extends TName> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
  mutative?: MutativeOptions;
  name: Name;
};
