import 'react-native-reanimated';
import './global.css';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider } from '@/components/providers/app-provider';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useFont } from '@/hooks/use-font';
import { useTheme } from '@/hooks/use-theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded } = useFont();

  if (!fontsLoaded)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading fonts...</Text>
      </View>
    );

  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  // useNotificationSync();

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
