export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      indent: ['error', 2],
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
      'comma-dangle': ['error', 'always-multiline']
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
]
