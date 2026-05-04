import { vars } from 'nativewind';

//  --------------- Text Font Sizes ---------------
export type TextSizeType =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export const TEXT_SIZES: Record<TextSizeType, number> = {
  xxs: 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

//  --------------- Font Families ---------------
export const FONT_FAMILIES = {
  GoogleSans: {
    'GoogleSans-Regular': require('@/assets/fonts/Google_Sans/static/GoogleSans-Regular.ttf'),
    'GoogleSans-Italic': require('@/assets/fonts/Google_Sans/static/GoogleSans-Italic.ttf'),
    'GoogleSans-Medium': require('@/assets/fonts/Google_Sans/static/GoogleSans-Medium.ttf'),
    'GoogleSans-MediumItalic': require('@/assets/fonts/Google_Sans/static/GoogleSans-MediumItalic.ttf'),
    'GoogleSans-SemiBold': require('@/assets/fonts/Google_Sans/static/GoogleSans-SemiBold.ttf'),
    'GoogleSans-SemiBoldItalic': require('@/assets/fonts/Google_Sans/static/GoogleSans-SemiBoldItalic.ttf'),
    'GoogleSans-Bold': require('@/assets/fonts/Google_Sans/static/GoogleSans-Bold.ttf'),
    'GoogleSans-BoldItalic': require('@/assets/fonts/Google_Sans/static/GoogleSans-BoldItalic.ttf'),
  },
};

export type FontFamilyType = keyof typeof FONT_FAMILIES;
export type FontFamily = FontFamilyType extends keyof typeof FONT_FAMILIES
  ? (typeof FONT_FAMILIES)[FontFamilyType]
  : never;

//  --------------- Colors ---------------
export const COLORS = {
  light: {
    background: '#ffffff',
    foreground: '#242528',
    card: '#ffffff',
    cardForeground: '#242528',
    popover: '#ffffff',
    popoverForeground: '#242528',
    primary: '#3b6eff',
    primaryForeground: '#f0f4fe',
    secondary: '#f5f4f7',
    secondaryForeground: '#35363a',
    muted: '#f5f6f7',
    mutedForeground: '#8a919e',
    accent: '#f5f6f7',
    accentForeground: '#383a3f',
    destructive: '#d44c2f',
    border: '#ebecf0',
    input: '#ebecf0',
    ring: '#c2c6cc',
    chart1: '#96b0ff',
    chart2: '#5c8eff',
    chart3: '#446eff',
    chart4: '#3b6eff',
    chart5: '#2e54d9',
    sidebar: '#fbfcfd',
    sidebarForeground: '#242528',
    sidebarPrimary: '#446eff',
    sidebarPrimaryForeground: '#f0f4fe',
    sidebarAccent: '#f5f6f7',
    sidebarAccentForeground: '#383a3f',
    sidebarBorder: '#ebecf0',
    sidebarRing: '#c2c6cc',
  },
  dark: {
    background: '#242528',
    foreground: '#f5f6f7',
    card: '#383a3f',
    cardForeground: '#f5f6f7',
    popover: '#383a3f',
    popoverForeground: '#f5f6f7',
    primary: '#2e54d9',
    primaryForeground: '#f0f4fe',
    secondary: '#4a4c52',
    secondaryForeground: '#ffffff',
    muted: '#4b4e56',
    mutedForeground: '#c2c6cc',
    accent: '#4b4e56',
    accentForeground: '#f5f6f7',
    destructive: '#e06c48',
    border: '#ffffff1a',
    input: '#ffffff26',
    ring: '#8a919e',
    chart1: '#96b0ff',
    chart2: '#5c8eff',
    chart3: '#446eff',
    chart4: '#3b6eff',
    chart5: '#2e54d9',
    sidebar: '#383a3f',
    sidebarForeground: '#f5f6f7',
    sidebarPrimary: '#5c8eff',
    sidebarPrimaryForeground: '#f0f4fe',
    sidebarAccent: '#4b4e56',
    sidebarAccentForeground: '#f5f6f7',
    sidebarBorder: '#ffffff1a',
    sidebarRing: '#8a919e',
  },
};

export type ColorSchemeType = keyof typeof COLORS;
export type ColorScheme = ColorSchemeType extends keyof typeof COLORS
  ? (typeof COLORS)[ColorSchemeType]
  : never;

const { light, dark } = COLORS;

export const THEMES: Record<ColorSchemeType, ReturnType<typeof vars>> = {
  light: vars({
    '--color-background': light.background,
    '--color-foreground': light.foreground,
    '--color-card': light.card,
    '--color-card-foreground': light.cardForeground,
    '--color-popover': light.popover,
    '--color-popover-foreground': light.popoverForeground,
    '--color-primary': light.primary,
    '--color-primary-foreground': light.primaryForeground,
    '--color-secondary': light.secondary,
    '--color-secondary-foreground': light.secondaryForeground,
    '--color-muted': light.muted,
    '--color-muted-foreground': light.mutedForeground,
    '--color-accent': light.accent,
    '--color-accent-foreground': light.accentForeground,
    '--color-destructive': light.destructive,
    '--color-border': light.border,
    '--color-input': light.input,
    '--color-ring': light.ring,
    '--color-chart-1': light.chart1,
    '--color-chart-2': light.chart2,
    '--color-chart-3': light.chart3,
    '--color-chart-4': light.chart4,
    '--color-chart-5': light.chart5,
    '--color-sidebar': light.sidebar,
    '--color-sidebar-foreground': light.sidebarForeground,
    '--color-sidebar-primary': light.sidebarPrimary,
    '--color-sidebar-primary-foreground': light.sidebarPrimaryForeground,
    '--color-sidebar-accent': light.sidebarAccent,
    '--color-sidebar-accent-foreground': light.sidebarAccentForeground,
    '--color-sidebar-border': light.sidebarBorder,
    '--color-sidebar-ring': light.sidebarRing,
  }),
  dark: vars({
    '--color-background': dark.background,
    '--color-foreground': dark.foreground,
    '--color-card': dark.card,
    '--color-card-foreground': dark.cardForeground,
    '--color-popover': dark.popover,
    '--color-popover-foreground': dark.popoverForeground,
    '--color-primary': dark.primary,
    '--color-primary-foreground': dark.primaryForeground,
    '--color-secondary': dark.secondary,
    '--color-secondary-foreground': dark.secondaryForeground,
    '--color-muted': dark.muted,
    '--color-muted-foreground': dark.mutedForeground,
    '--color-accent': dark.accent,
    '--color-accent-foreground': dark.accentForeground,
    '--color-destructive': dark.destructive,
    '--color-border': dark.border,
    '--color-input': dark.input,
    '--color-ring': dark.ring,
    '--color-chart-1': dark.chart1,
    '--color-chart-2': dark.chart2,
    '--color-chart-3': dark.chart3,
    '--color-chart-4': dark.chart4,
    '--color-chart-5': dark.chart5,
    '--color-sidebar': dark.sidebar,
    '--color-sidebar-foreground': dark.sidebarForeground,
    '--color-sidebar-primary': dark.sidebarPrimary,
    '--color-sidebar-primary-foreground': dark.sidebarPrimaryForeground,
    '--color-sidebar-accent': dark.sidebarAccent,
    '--color-sidebar-accent-foreground': dark.sidebarAccentForeground,
    '--color-sidebar-border': dark.sidebarBorder,
    '--color-sidebar-ring': dark.sidebarRing,
  }),
};
