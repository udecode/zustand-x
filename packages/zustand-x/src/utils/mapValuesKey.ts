import { mapValues } from 'lodash';

export const mapValuesKey = <
  VK extends string,
  T extends Record<VK, any>,
  R extends Record<keyof R, T>,
>(
  key: VK,
  obj: R
) => mapValues(obj, (value) => value[key]) as { [K in keyof R]: R[K][VK] };

// export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
//
// type ValueOf<T> = T[keyof T];
//
// // todo: hard to map values to key
// export const createRootStore = <
//   K extends keyof Input,
//   Input extends Record<K, any>
// >(
//   stores: Input
// ) => {
//   const rootStore = {};
//
//   Object.keys(stores).forEach((key) => {
//     const store = stores[key];
//     rootStore[store.name] = store;
//   });
//
//   return rootStore as {
//     [P in ValueOf<{ [K in keyof Input]: Input[K]['name'] }>]: Input[P];
//   };
// };
