# Theme (`src/theme`)

Thư mục gom **màu**, **biến NativeWind**, **token responsive**, và **typography (metrics chữ)**. Mục tiêu: một nguồn sự thật cho giao diện; tách rõ “token” vs “preset dùng trong UI”.

## Cấu trúc

```
theme/
├── index.ts                 # Barrel: export công khai chính
├── colors.ts                # Bảng màu raw (light / dark)
├── nativewind-vars.ts       # THEMES — map màu → CSS variables (NativeWind)
├── tokens/
│   └── responsive-scale.ts  # BREAKPOINTS + TYPOGRAPHY_SCALE (scale cỡ chữ)
└── typography/
    ├── index.ts             # Barrel typography
    ├── types.ts             # FontMetrics, TypographyVariant
    ├── fonts.ts             # FONT_FAMILIES, TEXT_SIZES (require font + token size)
    ├── font-tokens.ts       # getFontFamily, getFontSize
    ├── google-sans-metrics.ts
    ├── presets.ts           # Object `typography` (getter theo variant)
    └── …                    # Thêm font: inter-metrics.ts, v.v.
```

## Import nhanh

| Nhu cầu | Import |
|--------|----------|
| Màu + `THEMES` cho provider | `import { COLORS, THEMES, type ColorScheme } from '@/theme'` |
| Toàn bộ typography + font registry | `import { typography, FONT_FAMILIES, getFontFamily } from '@/theme'` |
| Chỉ breakpoint / scale chữ | `import { BREAKPOINTS, TYPOGRAPHY_SCALE } from '@/theme/tokens/responsive-scale'` |
| Chỉ preset `typography.*` | `import { typography } from '@/theme/typography'` hoặc `@/theme` |

## Quy ước

- **`colors.ts`**: chỉ hex/token màu, không phụ thuộc NativeWind (trừ khi sau này tách thêm layer).
- **`nativewind-vars.ts`**: nối `COLORS` với `vars({ '--color-*': … })` dùng trong `ThemeProvider` (`style={THEMES[mode]}`).
- **`tokens/responsive-scale.ts`**: dùng chung cho `lib/responsive.ts` (`responsiveFontSize`, `responsiveValue`), không gắn font cụ thể.
- **`typography/`**: mọi thứ liên quan **font file**, **tên family**, **cỡ/resolver** theo từng bộ font. Preset `typography` trong `presets.ts` chỉ gom metrics (fontSize, fontFamily, lineHeight, …) — **màu / căn / transform** để NativeWind ở component (xem `components/ui/Text/README.md`).

## Thêm bộ font mới

1. Khai báo `require(...)` trong `typography/fonts.ts` (hoặc file `typography/fonts/<name>.ts` nếu tách nhỏ).
2. Thêm resolver tương tự `google-sans-metrics.ts`.
3. (Tuỳ chọn) Thêm preset trong `presets.ts` hoặc file preset riêng rồi export qua `typography/index.ts`.

## Provider

`ThemeProvider` import `COLORS`, `THEMES` từ `@/theme` và bọc `View` với `style={THEMES[currentTheme]}` để toàn app nhận CSS variables cho NativeWind.
