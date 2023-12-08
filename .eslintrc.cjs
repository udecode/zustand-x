const {
  getDefaultIgnorePatterns,
} = require('./config/eslint/helpers/getDefaultIgnorePatterns.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'turbo',

    './config/eslint/bases/javascript.cjs',
    './config/eslint/bases/typescript.cjs',
    './config/eslint/bases/regexp.cjs',
    './config/eslint/bases/jest.cjs',
    './config/eslint/bases/react.cjs',
    './config/eslint/bases/rtl.cjs',

    './config/eslint/bases/unicorn.cjs',

    './config/eslint/bases/prettier.cjs',
  ],
  ignorePatterns: [
    ...getDefaultIgnorePatterns(),
    '.next',
    '.out',
    '**/__registry__',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
    webextensions: false,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules'],
        typescript: {
          alwaysTryTypes: true,
        },
      },
      typescript: {},
    },
    react: { version: 'detect' },
  },
  rules: {},
  overrides: [
    {
      files: ['**/*.spec.*'],
      extends: ['./config/eslint/bases/prettier.cjs'],
      rules: {
        'react/jsx-key': 'off',
        'import/no-relative-packages': 'off',
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/*.fixture.*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        // 'react-hooks/rules-of-hooks': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: [],
          },
        ],
      },
    },
    {
      files: '**/*.mdx',
      rules: {
        'prettier/prettier': 'off',
      },
    },
  ],
};
