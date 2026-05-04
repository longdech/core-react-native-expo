import { responsiveFontSize } from '@/lib/responsive';
import { TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale';
import type { TextSizeType } from '@/theme/typography/fonts';
import {
  type FontWeightType,
  getFontFamily,
  getFontSize,
  type TextFontStyleType,
} from '@/theme/typography/font-tokens';
import type { FontMetrics, TypographyVariant } from '@/theme/typography/types';

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
  display: { baseSize: 48, responsiveType: 'DISPLAY', weight: 'Bold' },
  h1: { baseSize: 32, responsiveType: 'DISPLAY', weight: 'Bold' },
  h2: { baseSize: 24, responsiveType: 'CONTENT', weight: 'SemiBold' },
  h3: { baseSize: 20, responsiveType: 'CONTENT', weight: 'SemiBold' },
  body: { baseSize: 16, responsiveType: 'CONTENT', weight: 'Regular' },
  caption: { baseSize: 12, responsiveType: 'UI', weight: 'Regular' },
  button: { baseSize: 16, responsiveType: 'TOUCH', weight: 'SemiBold' },
  input: { baseSize: 16, responsiveType: 'UI', weight: 'Regular' },
};

/** Preset NativeWind theo variant (không dùng cho font metrics). */
export const googleSansVariantClassName: Partial<Record<TypographyVariant, string>> = {
  // button: 'text-center uppercase',
};

export function resolveGoogleSansVariantMetrics({
  variant,
  weight,
  fontStyle = 'normal',
  responsiveType,
}: {
  variant: TypographyVariant;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
}): FontMetrics {
  const cfg = variantConfig[variant];
  const scaleType = responsiveType ?? cfg.responsiveType;
  const resolvedWeight = weight ?? cfg.weight;
  const fontFamily = getFontFamily({
    fontFamily: 'GoogleSans',
    fontStyle,
    weight: resolvedWeight,
  });
  const fontSize = responsiveFontSize(cfg.baseSize, scaleType);
  const metrics: FontMetrics = { fontFamily, fontSize };
  if (variant === 'body') {
    metrics.lineHeight = responsiveFontSize(24, scaleType);
  }
  if (variant === 'display') {
    metrics.letterSpacing = -0.5;
  }
  return metrics;
}

export function resolveGoogleSansSizeMetrics({
  size,
  weight = 'Regular',
  fontStyle = 'normal',
  responsiveType,
}: {
  size: TextSizeType;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  responsiveType?: ScaleKey;
}): FontMetrics {
  const scaleType = responsiveType ?? SIZE_TO_SCALE[size];
  return {
    fontFamily: getFontFamily({ fontFamily: 'GoogleSans', fontStyle, weight }),
    fontSize: responsiveFontSize(getFontSize(size), scaleType),
  };
}

export function getGoogleSansThemeMetrics(variant: TypographyVariant): FontMetrics {
  return resolveGoogleSansVariantMetrics({ variant });
}
