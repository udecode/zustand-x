export interface DevtoolsOptions {
  enabled?: boolean;
  serialize?: {
    options:
      | boolean
      | {
          date?: boolean;
          regex?: boolean;
          undefined?: boolean;
          nan?: boolean;
          infinity?: boolean;
          error?: boolean;
          symbol?: boolean;
          map?: boolean;
          set?: boolean;
        };
  };
}
