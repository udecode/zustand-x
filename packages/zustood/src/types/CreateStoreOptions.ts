import { State } from 'zustand';
import { PersistOptions } from './PersistOptions';
import { DevtoolsOptions } from './DevtoolsOptions';

export interface CreateStoreOptions<T extends State> {
  /**
   * Zustand middlewares
   */
  middlewares?: any[];

  /**
   * Devtools middleware options
   */
  devtools?: DevtoolsOptions;

  /**
   * Persist middleware options
   */
  persist?: PersistOptions<T>;

  /**
   * Enable immer autofreeze
   */
  enableAutoFreeze?: boolean;
}
