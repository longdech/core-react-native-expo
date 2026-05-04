import { TextSizeType } from '@/constants/Themes';
import { normalize } from '@/lib/responsiveFont';
import { cn } from '@/lib/tailwind';
import { ReactNode } from 'react';
import { Text as RNText, StyleProp, TextProps, TextStyle } from 'react-native';
import { FontWeightType, getFontFamily, getFontSize, TextFontStyleType } from './utils';

export interface GoogleSansTextProps extends Omit<TextProps, 'children' | 'style' | 'className'> {
  className?: string;
  style?: StyleProp<TextStyle>;
  weight?: FontWeightType;
  fontStyle?: TextFontStyleType;
  size?: TextSizeType;
  children: ReactNode;
}

export const GoogleSansText = ({
  weight = 'Regular',
  fontStyle = 'normal',
  style,
  className,
  children,
  size = 'base',
  ...rest
}: GoogleSansTextProps) => {
  return (
    <RNText
      className={cn('text-foreground', className)}
      style={[
        {
          fontFamily: getFontFamily({ fontFamily: 'GoogleSans', fontStyle, weight }),
          fontSize: normalize(getFontSize(size)),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};
