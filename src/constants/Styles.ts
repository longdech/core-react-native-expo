export const STYLES = {
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    '2xl': 18,
    '3xl': 22,
    '4xl': 26,
  },
  fontSize: {
    xxs: ['10px', { lineHeight: '16px' }],
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '40px' }],
    '4xl': ['36px', { lineHeight: '48px' }],
    '5xl': ['48px', { lineHeight: '64px' }],
  },
};

export type FontSizeType = keyof typeof STYLES.fontSize;
export type FontSize = FontSizeType extends keyof typeof STYLES.fontSize
  ? (typeof STYLES.fontSize)[FontSizeType]
  : never;
export default STYLES;
