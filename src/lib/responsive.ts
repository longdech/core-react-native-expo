import { Dimensions, PixelRatio, Platform } from 'react-native';
import { BREAKPOINTS, TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale';

/** Luôn đọc kích thước mới (xoay màn hình, split view). */
function getWindow() {
  return Dimensions.get('window');
}

/**
 * Smart scaling với clamp và platform-specific adjustment.
 * Gọi mỗi lần render / sau khi Dimensions đổi → kết quả đúng với màn hiện tại.
 */
export const responsiveFontSize = (
  baseSize: number,
  type: keyof typeof TYPOGRAPHY_SCALE = 'CONTENT',
): number => {
  const { width: screenWidth } = getWindow();
  const { min, max, factor } = TYPOGRAPHY_SCALE[type];
  const scale = screenWidth / BREAKPOINTS.PHONE;
  let newSize = baseSize * (1 + (scale - 1) * factor);
  newSize = Math.min(Math.max(newSize, min), max);
  if (Platform.OS === 'android') {
    newSize += 1;
  }
  return PixelRatio.roundToNearestPixel(newSize);
};

/**
 * Responsive theo breakpoint (đọc width hiện tại mỗi lần gọi).
 */
export const responsiveValue = <T>({
  phone,
  phoneLarge,
  tablet,
  desktop,
}: {
  phone: T;
  phoneLarge?: T;
  tablet?: T;
  desktop?: T;
}): T => {
  const w = getWindow().width;
  if (w >= BREAKPOINTS.DESKTOP && desktop !== undefined) return desktop;
  if (w >= BREAKPOINTS.TABLET && tablet !== undefined) return tablet;
  if (w >= BREAKPOINTS.PHONE_LARGE && phoneLarge !== undefined) return phoneLarge;
  return phone;
};

export function getScreenWidth() {
  return getWindow().width;
}

export function getScreenHeight() {
  return getWindow().height;
}

export function getIsTablet() {
  return getScreenWidth() >= BREAKPOINTS.TABLET;
}
