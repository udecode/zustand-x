module.exports = {
  extends: ['./scripts/.eslintrc.base'],
  plugins: ['@typescript-eslint', 'import'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      extends: [
        'airbnb-typescript/base',
        './scripts/.eslintrc.base-ts',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      ],
      rules: {
        'prettier/prettier': 'warn',
      },
    },
  ],
};
