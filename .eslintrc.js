// eslint-disable-next-line no-undef
module.exports = {
  env: {
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:import/recommended', 'prettier'],
  plugins: ['prettier', 'jest'],
  rules: {
    'func-style': ['error', 'expression'],
    'arrow-body-style': ['error', 'as-needed'],
  },
};
