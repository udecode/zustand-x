import { DevtoolsOptions } from 'zustand/middleware';

import { State } from '../types';
import { ImmerOptions } from './ImmerOptions';
import { PersistOptions } from './PersistOptions';

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
  persist?: PersistOptions<Partial<T>>;
}
