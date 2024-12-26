import { DevtoolsOptions as _DevtoolsOptions } from 'zustand/middleware';

import { MiddlewareOption } from '../types';

export { devtools as devToolsMiddleware } from 'zustand/middleware';

export type DevtoolsOptions = MiddlewareOption<Partial<_DevtoolsOptions>>;
