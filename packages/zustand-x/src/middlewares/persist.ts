import { PersistOptions as _PersistOptions } from 'zustand/middleware';

import { MiddlewareOption } from '../types';

export { persist as persistMiddleware } from 'zustand/middleware';
export type PersistOptions<StateType> = MiddlewareOption<
  Partial<_PersistOptions<StateType, Partial<StateType>>>
>;
