import { forwardRef } from 'react';
import {
  type StyleProp,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { cn } from '@/lib/tailwind';
import type { FontMetrics } from '@/theme/typography/types';

export type BaseTextProps = Omit<RNTextProps, 'style' | 'className'> & {
  /** fontSize, fontFamily, lineHeight, … — từ `@/theme/typography`. */
  fontMetrics: FontMetrics;
  className?: string;
  style?: StyleProp<TextStyle>;
};

/**
 * Lớp chung: gộp metrics chữ + NativeWind (`className`).
 * Mỗi font family nên có component riêng gọi `resolve*Metrics` rồi render `BaseText`.
 */
export const BaseText = forwardRef<RNText, BaseTextProps>(function BaseText(
  { fontMetrics, className, style, ...rest },
  ref,
) {
  return <RNText ref={ref} className={cn(className)} style={[fontMetrics, style]} {...rest} />;
});
