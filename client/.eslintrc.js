module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
    'react/prop-types': [0],
    'space-before-function-paren': [0],
    'space-in-parens': ['error', 'never'],
    'comma-spacing': ['error', {'before': false, 'after': true}],
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'space-infix-ops': ['error'],
  },
  settings: {
    react: {
      version: 'detect'
    }
  } 
};
