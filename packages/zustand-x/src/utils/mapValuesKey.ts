import mapValues from 'lodash.mapvalues';

import { TStateApi } from '../types';

export const mapValuesKey = <
  VK extends keyof TStateApi<any, any, any, any>,
  T extends Record<VK, any>,
  R extends Record<keyof R, T>,
>(
  key: VK,
  obj: R
) => mapValues(obj, (value) => value[key]) as { [K in keyof R]: R[K][VK] };
