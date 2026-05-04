import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { FONT_FAMILIES } from '@/theme';

export const useFont = () => {
  const isEmbedded =
    Platform.OS !== 'web' && !__DEV__ && Constants.executionEnvironment === 'storeClient';

  const [fontsLoaded, fontError] = useFonts(
    isEmbedded ? {} : { ...FONT_FAMILIES.GoogleSans, ...FONT_FAMILIES.BeVietnamPro },
  );

  useEffect(() => {
    if (fontsLoaded || fontError || isEmbedded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isEmbedded]);

  return { fontsLoaded: isEmbedded || fontsLoaded, fontError };
};
