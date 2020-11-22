module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    indent: ['error', 2, {SwitchCase: 2}],
    semi: ['error', 'always'],
    'space-before-function-paren': [0],
    'space-in-parens': ['error', 'never'],
    'comma-spacing': ['error', {before: false, after: true}],
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'space-infix-ops': ['error']
  }
};
