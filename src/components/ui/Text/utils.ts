import { FontFamilyType, TEXT_SIZES, TextSizeType } from '@/constants/Themes';

export const getFontSize = (size: TextSizeType) => {
  return TEXT_SIZES[size];
};

export type FontWeightType = 'Regular' | 'Medium' | 'SemiBold' | 'Bold';
export type TextFontStyleType = 'normal' | 'italic';

export const getFontFamily = ({
  fontFamily = 'GoogleSans',
  fontStyle = 'normal',
  weight = 'Regular',
}: {
  fontFamily?: FontFamilyType;
  fontStyle?: TextFontStyleType;
  weight?: FontWeightType;
}) => {
  if (fontStyle === 'italic' && weight !== 'Regular') {
    return `${fontFamily}-${weight}Italic`;
  }
  if (fontStyle === 'italic') {
    return `${fontFamily}-Italic`;
  }
  return `${fontFamily}-${weight}`;
};
