# Text (`src/components/ui/Text`)

Component chữ theo hướng: **metrics chữ** (fontSize, fontFamily, …) lấy từ `@/theme/typography`,
**mọi thứ còn lại** (màu, spacing, căn, uppercase, …) qua **`className` (NativeWind)**.

## Cấu trúc

```
Text/
├── index.ts                      # Export công khai
├── core/
│   ├── base-text.tsx             # RN Text + fontMetrics + className
│   └── create-font-metrics-text.tsx  # Factory cho font mới
└── fonts/
    ├── google-sans/
    │   ├── google-sans-text.tsx
    │   └── index.ts
    └── be-vietnam-pro/
        ├── be-vietnam-pro-text.tsx
        └── index.ts
```

## `BaseText`

Nhận **`fontMetrics`** (bắt buộc) + `className` + `style`. Không biết font nào — dùng làm nền cho
mọi bộ font.

## `GoogleSansText`

- **`variant`**: semantic (`display`, `h1`, … `input`) — dùng resolver trong
  `@/theme/typography/google-sans-metrics`.
- **`size`**: token `xxs` … `5xl` khi không dùng `variant` (mặc định coi như `size="base"` nếu không
  truyền `variant`).
- Nếu có **`variant`**, nó **ưu tiên** hơn `size`.
- **`className`**: NativeWind (`text-primary`, `mt-2`, …).
- **`weight`**, **`fontStyle`**, **`responsiveType`**: ghi đè tùy chọn so với mặc định của
  variant/size.

Preset NativeWind theo variant (ví dụ nút): `variant="button"` tự thêm `text-center uppercase`
(không nằm trong font metrics).

## `BeVietnamProText`

Cùng API với `GoogleSansText` (`variant` / `size` / `weight` / `className` …), metrics từ
`@/theme/typography/be-vietnam-pro-metrics`. Toàn bộ file Be Vietnam Pro trong
`src/assets/fonts/Be_Vietnam_Pro` đã đăng ký trong `FONT_FAMILIES.BeVietnamPro` và được gộp vào
`useFonts` ở root.

## `createFontMetricsText`

Dùng khi thêm font khác (Inter, …): cung cấp hàm `resolveFontMetrics(props) => FontMetrics`, nhận
lại component đã gắn `BaseText` + `defaultClassName` tùy chọn.

## Import

```ts
import {
  BaseText,
  BeVietnamProText,
  GoogleSansText,
  createFontMetricsText,
  getFontFamily,
  getFontSize,
  type FontMetrics,
  type TypographyVariant,
} from '@/components/ui/Text';
```

## Ví dụ

```tsx
<GoogleSansText variant="h1" className="text-primary">
  Tiêu đề
</GoogleSansText>

<GoogleSansText size="sm" weight="Medium" className="text-muted-foreground">
  Phụ đề
</GoogleSansText>
```

## Quan hệ với `theme`

- Metrics resolve từ `@/theme/typography/*` (không nhân đôi logic trong `Text/`).
- Dùng object preset: `import { typography } from '@/theme'` rồi `style={[typography.body, …]}` kèm
  `className` NativeWind trên cùng node hoặc wrapper.
