/** Breakpoint layout + thang scale cho `responsiveFontSize`. */
export const BREAKPOINTS = {
  PHONE: 375,
  PHONE_LARGE: 414,
  TABLET: 768,
  DESKTOP: 1024,
} as const;

export const TYPOGRAPHY_SCALE = {
  CONTENT: { min: 14, max: 28, factor: 1 },
  UI: { min: 12, max: 20, factor: 0.5 },
  TOUCH: { min: 14, max: 16, factor: 0.2 },
  DISPLAY: { min: 32, max: 72, factor: 1.2 },
} as const;
