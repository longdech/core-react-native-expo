import { TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale';
import {
  type FontWeightType,
  getFontFamily,
  getFontSize,
  type TextFontStyleType,
} from '@/theme/typography/font-tokens';
import { FontFamilyType, TEXT_SIZES, type TextSizeType } from '@/theme/typography/fonts';
import type { FontMetrics, TypographyVariant } from '@/theme/typography/types';
import { responsiveFontSize } from '@/utils/responsive';

type ScaleKey = keyof typeof TYPOGRAPHY_SCALE;

const SIZE_TO_SCALE: Record<TextSizeType, ScaleKey> = {
  xxs: 'UI',
  xs: 'UI',
  sm: 'UI',
  base: 'CONTENT',
  lg: 'CONTENT',
  xl: 'CONTENT',
  '2xl': 'CONTENT',
  '3xl': 'DISPLAY',
  '4xl': 'DISPLAY',
  '5xl': 'DISPLAY',
};

const variantConfig: Record<
  TypographyVariant,
  { baseSize: number; responsiveType: ScaleKey; weight: FontWeightType }
> = {
  display: { baseSize: TEXT_SIZES['5xl'], responsiveType: 'DISPLAY', weight: 'Bold' },
  h1: { baseSize: TEXT_SIZES['4xl'], responsiveType: 'DISPLAY', weight: 'Bold' },
  h2: { baseSize: TEXT_SIZES['3xl'], responsiveType: 'CONTENT', weight: 'SemiBold' },
  h3: { baseSize: TEXT_SIZES['2xl'], responsiveType: 'CONTENT', weight: 'SemiBold' },
  body: { baseSize: TEXT_SIZES['base'], responsiveType: 'CONTENT', weight: 'Regular' },
  caption: { baseSize: TEXT_SIZES['xs'], responsiveType: 'UI', weight: 'Regular' },
  button: { baseSize: TEXT_SIZES['sm'], responsiveType: 'TOUCH', weight: 'SemiBold' },
  input: { baseSize: TEXT_SIZES['sm'], responsiveType: 'UI', weight: 'Regular' },
};

/** Preset NativeWind theo variant (không dùng cho font metrics). */
export const fontVariantClassName: Partial<Record<TypographyVariant, string>> = {
  // button: 'text-center uppercase',
};

export function resolveFontVariantMetrics({
  fontFamily,
  variant,
  weight,
  fontStyle = 'normal',
  responsiveType,
}: {
  fontFamily: FontFamilyType;
  variant: TypographyVariant;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
}): FontMetrics {
  const cfg = variantConfig[variant];
  const scaleType = responsiveType ?? cfg.responsiveType;
  const resolvedWeight = weight ?? cfg.weight;
  const resolvedFontFamily = getFontFamily({
    fontFamily,
    fontStyle,
    weight: resolvedWeight,
  });
  const fontSize = responsiveFontSize(cfg.baseSize, scaleType);
  const metrics: FontMetrics = { fontFamily: resolvedFontFamily, fontSize };
  if (variant === 'body') {
    metrics.lineHeight = responsiveFontSize(24, scaleType);
  }
  if (variant === 'display') {
    metrics.letterSpacing = -0.5;
  }
  return metrics;
}

export function resolveFontSizeMetrics({
  fontFamily,
  size,
  weight = 'Regular',
  fontStyle = 'normal',
  responsiveType,
}: {
  fontFamily: FontFamilyType;
  size: TextSizeType;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
}): FontMetrics {
  const scaleType = responsiveType ?? SIZE_TO_SCALE[size];
  return {
    fontFamily: getFontFamily({ fontFamily, fontStyle, weight }),
    fontSize: responsiveFontSize(getFontSize(size), scaleType),
  };
}
