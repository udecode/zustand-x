import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';

export type TBaseStoreOptions<StateType> = {
  persist?: PersistOptions<StateType>;
  devtools?: DevtoolsOptions;
  immer?: ImmerOptions;
};
