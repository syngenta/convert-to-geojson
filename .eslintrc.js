module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    // 'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {},
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    indent: ['error', 2],
    'no-mixed-spaces-and-tabs': 'error',
    'no-trailing-spaces': 'off',
    'no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '_', args: 'none' },
    ],
    'react/prop-types': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'brace-style': ['error', '1tbs'],
    'max-len': [
      'error',
      {
        code: 100, // Adjust based on your preferred line length
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$', // Ignore import statements
      },
    ],
  },
};
