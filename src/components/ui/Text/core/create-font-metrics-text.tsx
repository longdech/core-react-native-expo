import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Text, type TextProps } from 'react-native';

import { BaseText } from '@/components/ui/Text/core/base-text';
import { cn } from '@/lib/tailwind';
import type { FontMetrics } from '@/theme/typography/types';

type NativeTextRest = Omit<TextProps, 'style' | 'className' | 'children'>;

/**
 * Tạo component chữ cho một font: bạn cung cấp `resolveFontMetrics`, phần còn lại dùng NativeWind qua `className`.
 *
 * @example
 * export const InterText = createFontMetricsText(
 *   'InterText',
 *   (p: { weight: '400' | '700' }) => ({ fontFamily: p.weight === '700' ? 'Inter-Bold' : 'Inter-Regular', fontSize: 16 }),
 *   'text-foreground',
 * );
 */
export function createFontMetricsText<P extends object>(
  displayName: string,
  resolveFontMetrics: (props: P) => FontMetrics,
  defaultClassName?: string,
) {
  type Props = P &
    NativeTextRest & {
      className?: string;
      style?: TextProps['style'];
      children: ReactNode;
    };

  const Cmp = forwardRef<Text, Props>(function Cmp(props, ref) {
    const { className, style, children, ...rest } = props;
    const fontMetrics = resolveFontMetrics(rest as P);
    return (
      <BaseText
        ref={ref}
        fontMetrics={fontMetrics}
        className={cn(defaultClassName, className)}
        style={style}
        {...(rest as NativeTextRest)}
      >
        {children}
      </BaseText>
    );
  });
  Cmp.displayName = displayName;
  return Cmp;
}
