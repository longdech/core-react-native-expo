import { getGoogleSansThemeMetrics } from '@/theme/typography/google-sans-metrics';

/**
 * Style chỉ chứa metrics chữ (Google Sans). Màu / căn / transform thêm qua NativeWind.
 */
export const typography = {
  get display() {
    return getGoogleSansThemeMetrics('display');
  },
  get h1() {
    return getGoogleSansThemeMetrics('h1');
  },
  get h2() {
    return getGoogleSansThemeMetrics('h2');
  },
  get h3() {
    return getGoogleSansThemeMetrics('h3');
  },
  get body() {
    return getGoogleSansThemeMetrics('body');
  },
  get caption() {
    return getGoogleSansThemeMetrics('caption');
  },
  get button() {
    return getGoogleSansThemeMetrics('button');
  },
  get input() {
    return getGoogleSansThemeMetrics('input');
  },
} as const;

export type ThemeTypographyKey = keyof typeof typography;
