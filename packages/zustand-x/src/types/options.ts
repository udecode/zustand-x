import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';
import { MutativeOptions } from './../middlewares/mutative';
import { TState } from './utils';

export type TBaseStoreOptions<StateType extends TState> = {
  name: string;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
  mutative?: MutativeOptions;
  persist?: PersistOptions<StateType>;
};
