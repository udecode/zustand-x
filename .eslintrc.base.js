module.exports = {
  root: true,
  extends: [
    './.eslintrc.airbnb-base',
    'plugin:jest/recommended',

    // 'plugin:cypress/recommended',
    // 'plugin:mdx/recommended',
    // 'plugin:promise/recommended',

    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    'jest',
    'jest-formatting',
    'unused-imports',
    // 'promise',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
  },

  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@common', './packages/app/src/common']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src'],
        typescript: {
          alwaysTryTypes: true,
        },
      },
      typescript: {},
    },
  },
  rules: {
    'prettier/prettier': 'warn',

    'class-methods-use-this': 'off',
    'consistent-return': 'off',

    'global-require': 'off',

    // Test
    'jest/expect-expect': 'off',
    'jest/no-export': 'off',
    'jest/no-identical-title': 'off',
    'jest/no-standalone-expect': 'off',

    'linebreak-style': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],

    'mdx/no-unescaped-entities': 'off',
    'mdx/no-unused-expressions': 'off',

    'no-alert': 'off',
    'no-continue': 'off',
    'no-multi-assign': 'off',
    'no-await-in-loop': 'off',
    'no-empty': 'off',
    'no-empty-function': 'off',
    'no-console': [
      'warn',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    'no-nested-ternary': 'off', // short
    'no-new': 'off', // exceptions
    'no-param-reassign': 'off',
    'no-plusplus': 'off', // short
    'no-prototype-builtins': 'off', // short
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ], // for..of OK (break)
    'no-return-assign': 'off', // short
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-unexpected-multiline': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-constant-condition': 'off',
    'no-throw-literal': 'off',
    'no-use-before-define': 'off',
    'no-bitwise': 'off',

    'prefer-promise-reject-errors': 'off',
    // 'prefer-template': 'error',

    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'promise/no-callback-in-promise': 'off',

    'spaced-comment': 'warn',

    'max-classes-per-file': 'off',
    'default-case': 'off',
    camelcase: 'off',

    'jest/no-commented-out-tests': 'off',

    // https://github.com/benmosher/eslint-plugin-import/issues/1558
    'import/extensions': [
      'error',
      'never',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-cycle': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off', // Allow single Named-export
    'import/order': ['off', { 'newlines-between': 'always' }],
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true,
      },
    },
    {
      files: '**/*.stories.tsx',
      rules: {
        // just for showing the code in addon-docs
        'react-hooks/rules-of-hooks': 'off',
      },
    },
    {
      files: '**/*.mdx',
      rules: {
        'prettier/prettier': 'off',
        'simple-import-sort/imports': 'off',
        'import/order': ['error', { 'newlines-between': 'never' }],
      },
    },
  ],
};
