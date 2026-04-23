module.exports = {
  // Các plugin
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-packagejson'],

  // Basic formatting
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Đặc thù React Native/Expo
  jsxSingleQuote: false, // JSX dùng double quotes
  jsxBracketSameLine: false,

  // TailwindCSS specific (nếu dùng)
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],

  // Overrides cho từng loại file
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      options: {
        tabWidth: 2,
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: '*.{ts,tsx,js,jsx}',
      options: {
        importOrder: [
          '^(react/(.*)$)|^(react$)',
          '^(expo/(.*)$)|^(expo$)',
          '^(react-native/(.*)$)|^(react-native$)',
          '<THIRD_PARTY_MODULES>',
          '^@/(.*)$',
          '^[./]',
        ],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      },
    },
  ],
};
