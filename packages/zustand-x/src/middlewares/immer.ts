import { MiddlewareOption } from '../types';

export { immer as immerMiddleware } from 'zustand/middleware/immer';
export type ImmerOptions = MiddlewareOption<{
  enableMapSet?: boolean;
  enabledAutoFreeze?: boolean;
}>;
