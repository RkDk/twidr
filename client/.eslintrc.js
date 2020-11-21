module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
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
    "react/prop-types": [0],
    "space-before-function-paren": [0],
    "space-in-parens": ['error', 'always'],
    'quotes': ['error', 'single']
  },
  settings: {
    react: {
      version: "detect"
    }
  } 
}
