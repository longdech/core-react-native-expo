import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import {
  type StyleProp,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { BaseText } from '@/components/ui/Text/core/base-text';
import { cn } from '@/lib/tailwind';
import type { TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale';
import type { FontWeightType, TextFontStyleType } from '@/theme/typography/font-tokens';
import type { TextSizeType } from '@/theme/typography/fonts';
import {
  googleSansVariantClassName,
  resolveGoogleSansSizeMetrics,
  resolveGoogleSansVariantMetrics,
} from '@/theme/typography/google-sans-metrics';
import type { TypographyVariant } from '@/theme/typography/types';

type ScaleKey = keyof typeof TYPOGRAPHY_SCALE;

export type GoogleSansTextProps = Omit<RNTextProps, 'children' | 'style' | 'className'> & {
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
 * Google Sans: metrics từ `@/theme/typography`, màu / layout / transform qua `className` (NativeWind).
 */
export const GoogleSansText = forwardRef<RNText, GoogleSansTextProps>(function GoogleSansText(
  {
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
      ? resolveGoogleSansVariantMetrics({
          variant,
          weight,
          fontStyle,
          responsiveType,
        })
      : resolveGoogleSansSizeMetrics({
          size: size ?? 'base',
          weight,
          fontStyle,
          responsiveType,
        });

  const variantTw = variant != null ? googleSansVariantClassName[variant] : undefined;

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
