import { DevtoolsOptions, ImmerOptions, PersistOptions } from '../middlewares';
import { MutativeOptions } from './../middlewares/mutative';
import { TState } from './utils';

export type TBaseStoreOptions<StateType extends TState> = {
  name: string;

  /**
   * Devtools middleware options.
   * https://zustand.docs.pmnd.rs/middlewares/devtools
   */
  devtools?: DevtoolsOptions;

  /**
   * Immer middleware options.
   * https://zustand.docs.pmnd.rs/middlewares/immer
   */
  immer?: ImmerOptions;

  /**
   * Mutative middleware options.
   * https://www.npmjs.com/package/mutative
   */
  mutative?: MutativeOptions;

  /**
   * Persist middleware options.
   * https://zustand.docs.pmnd.rs/middlewares/persist
   */
  persist?: PersistOptions<StateType>;

  /**
   * If you're using custom middleware like `immer` and `mutative`
   * and no need to return new state then set this value to `true`.
   */
  isMutativeState?: boolean;
};
