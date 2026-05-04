// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
  globalIgnores([
    'dist/*',
    'node_modules/',
    '.expo/',
    'android/',
    'ios/',
    'build/',
    'coverage/',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
  ]),

  expoConfig,

  {
    files: ['babel.config.js', 'metro.config.js', 'app.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
  },

  {
    rules: {
      'no-console': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]);
