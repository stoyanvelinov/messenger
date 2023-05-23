// eslint-disable-next-line no-undef
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'quotes': ['error', 'single'],
    // overrides
    'require-jsdoc': 0,
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'semi': 2,
    'no-undef': 2,
    'no-use-before-define': 0,
    'max-len': 0,
    'arrow-parens': 0,
    'padded-blocks': 0,
    'no-empty': 2,
    'no-irregular-whitespace': 2,
    'valid-jsdoc': 2,
    'valid-typeof': 2,
    'prefer-const': 2,
    'consistent-return': 2,
    'eqeqeq': 2,
    'no-redeclare': 2,
    ////////// Variables //////////
    'no-shadow': 2,
    'no-shadow-restricted-names': 2,
    'no-unused-vars': [
      'error',
      {
        'varsIgnorePattern': '_'
      }
    ]

  },
};