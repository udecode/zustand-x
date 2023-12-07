import { PersistOptions } from './PersistOptions';
import { ImmerOptions } from './ImmerOptions';
import { State } from '../types';
import { DevtoolsOptions } from 'zustand/middleware';

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
