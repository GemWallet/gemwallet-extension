module.exports = {
  extends: ['react-app', 'react-app/jest', 'prettier'],
  plugins: ['unused-imports'],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true // ignore case
        },
        pathGroupsExcludedImportTypes: ['react'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@gemwallet/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '**/*.scss',
            patternOptions: { dot: true, nocomment: true },
            group: 'unknown',
            position: 'after'
          }
        ]
      }
    ],
    'unused-imports/no-unused-imports': 'error'
  }
};
