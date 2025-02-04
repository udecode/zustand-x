const vitest = require('@vitest/eslint-plugin');

module.exports = {
  plugins: ['vitest'],
  overrides: [
    {
      files: ['**/?(*.)+(test|spec).{js,jsx,ts,tsx}'],
      rules: {
        ...vitest.configs.recommended.rules,
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        'import/default': 'off',
        'import/namespace': 'off',
        'import/no-duplicates': 'off',
        'import/no-named-as-default-member': 'off',
      },
    },
  ],
};
