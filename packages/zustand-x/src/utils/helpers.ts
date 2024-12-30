import { MiddlewareOption } from '../types';

export const getOptions = <T extends MiddlewareOption<object> | undefined>(
  option: T,
  fallbackEnabled: boolean = false
) => {
  const isBooleanValue = typeof option === 'boolean';
  const { enabled, ...config } = (
    isBooleanValue ? {} : option || {}
  ) as Exclude<T, boolean | undefined>;
  const isValueProvided = isBooleanValue ? option : enabled;
  return {
    enabled: isValueProvided ?? fallbackEnabled,
    ...config,
  };
};
