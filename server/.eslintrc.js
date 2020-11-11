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
    indent: ['error', 2],
    semi: ['error', 'always'],
    'space-before-function-paren': [0],
    'space-in-parens': ['error', 'always'],
    quotes: ['error', 'single']
  }
};
