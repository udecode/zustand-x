import { MiddlewareOption } from '../types';

export { enableMapSet, setAutoFreeze } from 'immer';

export { immer as immerMiddleware } from 'zustand/middleware/immer';
export type ImmerOptions = MiddlewareOption<{
  enableMapSet?: boolean;
  enabledAutoFreeze?: boolean;
}>;
