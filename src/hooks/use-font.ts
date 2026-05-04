import { useFonts } from 'expo-font';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { FONT_FAMILIES } from '@/theme';

export const useFont = () => {
  const isEmbedded =
    Platform.OS !== 'web' && !__DEV__ && Constants.executionEnvironment === 'storeClient';

  const [fontsLoaded, fontError] = useFonts(isEmbedded ? {} : { ...FONT_FAMILIES.GoogleSans });

  useEffect(() => {
    if (fontsLoaded || fontError || isEmbedded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isEmbedded]);

  return { fontsLoaded: isEmbedded || fontsLoaded, fontError };
};
