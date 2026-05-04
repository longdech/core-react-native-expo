import { Link } from 'expo-router';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleSansText } from '@/components/ui/Text';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center gap-6 p-4">
        <GoogleSansText size="base">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="h1">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="h2">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="h3">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="body">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="caption">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="button">Welcome to the app</GoogleSansText>
        <GoogleSansText variant="input">Welcome to the app</GoogleSansText>
        <Link href="/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
      </View>
    </SafeAreaView>
  );
}
