import { PersistOptions as _PersistOptions } from 'zustand/middleware';

export type StateStorage = {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
};
export type StorageValue<S> = { state: S; version: number };

export type PersistOptions<S> = _PersistOptions<S> & {
  enabled?: boolean;
};
