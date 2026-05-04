import type { TextStyle } from 'react-native';

/** Chỉ metrics chữ — màu, căn lề, spacing để NativeWind (`className`). */
export type FontMetrics = Pick<TextStyle, 'fontSize' | 'fontFamily'> &
  Partial<Pick<TextStyle, 'lineHeight' | 'letterSpacing' | 'fontStyle' | 'fontWeight'>>;

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'caption'
  | 'button'
  | 'input';
