/** Đăng ký font + token cỡ chữ (dùng cho `useFonts` + scale theo size). */
export type TextSizeType =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export const TEXT_SIZES: Record<TextSizeType, number> = {
  xxs: 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const FONT_FAMILIES = {
  GoogleSans: {
    'GoogleSans-Regular': require('@/assets/fonts/Google_Sans/GoogleSans-Regular.ttf'),
    'GoogleSans-Italic': require('@/assets/fonts/Google_Sans/GoogleSans-Italic.ttf'),
    'GoogleSans-Medium': require('@/assets/fonts/Google_Sans/GoogleSans-Medium.ttf'),
    'GoogleSans-MediumItalic': require('@/assets/fonts/Google_Sans/GoogleSans-MediumItalic.ttf'),
    'GoogleSans-SemiBold': require('@/assets/fonts/Google_Sans/GoogleSans-SemiBold.ttf'),
    'GoogleSans-SemiBoldItalic': require('@/assets/fonts/Google_Sans/GoogleSans-SemiBoldItalic.ttf'),
    'GoogleSans-Bold': require('@/assets/fonts/Google_Sans/GoogleSans-Bold.ttf'),
    'GoogleSans-BoldItalic': require('@/assets/fonts/Google_Sans/GoogleSans-BoldItalic.ttf'),
  },
  BeVietnamPro: {
    'BeVietnamPro-Regular': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Regular.ttf'),
    'BeVietnamPro-Italic': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Italic.ttf'),
    'BeVietnamPro-Medium': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Medium.ttf'),
    'BeVietnamPro-MediumItalic': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-MediumItalic.ttf'),
    'BeVietnamPro-SemiBold': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBold.ttf'),
    'BeVietnamPro-SemiBoldItalic': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBoldItalic.ttf'),
    'BeVietnamPro-Bold': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Bold.ttf'),
    'BeVietnamPro-BoldItalic': require('@/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-BoldItalic.ttf'),
  },
};

export type FontFamilyType = keyof typeof FONT_FAMILIES;
export type FontFamily = FontFamilyType extends keyof typeof FONT_FAMILIES
  ? (typeof FONT_FAMILIES)[FontFamilyType]
  : never;
