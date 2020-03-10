module.exports = {
    env: {
      es6: true,
      browser: true
    },
    extends: [
      'standard',
      "plugin:@typescript-eslint/recommended"
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module'
    },
    plugins: [
      '@typescript-eslint'
    ],
    rules: {
      "indent": [1, 4],
      "@typescript-eslint/explicit-function-return-type": [0]
    }
  }
