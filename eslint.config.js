// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // 1. Global ignores
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

  // 2. Config mặc định của Expo
  expoConfig,

  // 3. Custom rules cho các file cụ thể
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

  // 4. Rules bổ sung (nếu cần)
  {
    rules: {
      // Chỉ giữ các rule về logic, KHÔNG có rule về format
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
