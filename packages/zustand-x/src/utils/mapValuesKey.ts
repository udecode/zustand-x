import mapValues from 'lodash.mapvalues';

export const mapValuesKey = <
  VK extends string,
  T extends Record<VK, any>,
  R extends Record<keyof R, T>,
>(
  key: VK,
  obj: R
) => mapValues(obj, (value) => value[key]) as { [K in keyof R]: R[K][VK] };
