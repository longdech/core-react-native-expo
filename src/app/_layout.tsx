import 'react-native-reanimated';
import './global.css';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { AppProvider } from '@/components/providers/app-provider';
import { useAuth } from '@/hooks/use-auth';
import { useFont } from '@/hooks/use-font';
import { useTheme } from '@/hooks/use-theme';
import { useNotificationSync } from '@/services/notifications';
import { initializeMMKV } from '@/services/storage/secure-storage';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { fontsLoaded } = useFont();

  useEffect(() => {
    initializeMMKV().then(() => {
      setIsLoading(false);
    });
  }, []);

  // TODO: Add a loading screen here
  if (!fontsLoaded || isLoading) return null;

  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  useNotificationSync();

  return (
    <RNThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </RNThemeProvider>
  );
}
