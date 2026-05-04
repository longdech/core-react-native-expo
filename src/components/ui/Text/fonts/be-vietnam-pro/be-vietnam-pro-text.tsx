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
import {
  beVietnamProVariantClassName,
  resolveBeVietnamProSizeMetrics,
  resolveBeVietnamProVariantMetrics,
} from '@/theme/typography/be-vietnam-pro-metrics';
import type { FontWeightType, TextFontStyleType } from '@/theme/typography/font-tokens';
import type { TextSizeType } from '@/theme/typography/fonts';
import type { TypographyVariant } from '@/theme/typography/types';

type ScaleKey = keyof typeof TYPOGRAPHY_SCALE;

export type BeVietnamProTextProps = Omit<RNTextProps, 'children' | 'style' | 'className'> & {
  className?: string;
  style?: StyleProp<TextStyle>;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
  variant?: TypographyVariant;
  size?: TextSizeType;
  children: ReactNode;
};

/**
 * Be Vietnam Pro: metrics từ `@/theme/typography`, màu / layout qua `className` (NativeWind).
 */
export const BeVietnamProText = forwardRef<RNText, BeVietnamProTextProps>(function BeVietnamProText(
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
      ? resolveBeVietnamProVariantMetrics({
          variant,
          weight,
          fontStyle,
          responsiveType,
        })
      : resolveBeVietnamProSizeMetrics({
          size: size ?? 'base',
          weight,
          fontStyle,
          responsiveType,
        });

  const variantTw = variant != null ? beVietnamProVariantClassName[variant] : undefined;

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
