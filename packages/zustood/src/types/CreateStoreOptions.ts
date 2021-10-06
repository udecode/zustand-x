import { State } from 'zustand';
import { PersistOptions } from './PersistOptions';
import { DevtoolsOptions } from './DevtoolsOptions';
import { ImmerOptions } from './ImmerOptions';

export interface CreateStoreOptions<T extends State> {
  /**
   * Zustand middlewares.
   */
  middlewares?: any[];

  /**
   * Devtools middleware options.
   */
  devtools?: DevtoolsOptions;

  /**
   * Immer middleware options.
   */
  immer?: ImmerOptions;

  /**
   * Persist middleware options.
   */
  persist?: PersistOptions<T>;
}
