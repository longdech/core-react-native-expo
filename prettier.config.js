/**
 * Chỉ ghi lệch so với mặc định Prettier + plugin.
 * `prettier-plugin-tailwindcss` phải đứng cuối mảng `plugins`.
 */
module.exports = {
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],

  printWidth: 100,
  singleQuote: true,
  endOfLine: 'lf',

  jsxSingleQuote: false,

  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],

  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      options: { printWidth: 80 },
    },
    {
      files: '*.md',
      options: { proseWrap: 'always' },
    },
  ],
};
