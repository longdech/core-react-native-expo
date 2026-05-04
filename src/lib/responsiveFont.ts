import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export const normalize = (size: number, factor = 0.5) => {
  return Math.round(PixelRatio.roundToNearestPixel(size + (scale * size - size) * factor));
};
