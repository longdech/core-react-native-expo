import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import {
  type StyleProp,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { BaseText } from '@/components/ui/Text/base-text';
import { cn } from '@/lib/tailwind';
import type { TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale';
import {
  fontVariantClassName,
  resolveFontSizeMetrics,
  resolveFontVariantMetrics,
} from '@/theme/typography/font-metrics';
import type { FontWeightType, TextFontStyleType } from '@/theme/typography/font-tokens';
import type { FontFamilyType, TextSizeType } from '@/theme/typography/fonts';
import type { TypographyVariant } from '@/theme/typography/types';

type ScaleKey = keyof typeof TYPOGRAPHY_SCALE;

export type TextProps = Omit<RNTextProps, 'children' | 'style' | 'className'> & {
  fontFamily?: FontFamilyType;
  className?: string;
  style?: StyleProp<TextStyle>;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
  /** Semantic scale — ưu tiên hơn `size` khi có cả hai. */
  variant?: TypographyVariant;
  /** Token cỡ chữ (khi không dùng `variant`). Mặc định `base`. */
  size?: TextSizeType;
  children: ReactNode;
};

/**
 * Text: metrics từ `@/theme/typography`, màu / layout / transform qua `className` (NativeWind).
 */
export const Text = forwardRef<RNText, TextProps>(function Text(
  {
    fontFamily = 'Roboto',
    weight = 'Regular',
    fontStyle = 'normal',
    style,
    className,
    children,
    variant,
    size,
    responsiveType,
    ...rest
  },
  ref,
) {
  const fontMetrics =
    variant != null
      ? resolveFontVariantMetrics({
          fontFamily,
          variant,
          weight,
          fontStyle,
          responsiveType,
        })
      : resolveFontSizeMetrics({
          fontFamily,
          size: size ?? 'base',
          weight,
          fontStyle,
          responsiveType,
        });

  const variantTw = variant != null ? fontVariantClassName[variant] : undefined;

  return (
    <BaseText
      ref={ref}
      fontMetrics={fontMetrics}
      className={cn('text-foreground', variantTw, className)}
      style={style}
      {...rest}
    >
      {children}
    </BaseText>
  );
});
