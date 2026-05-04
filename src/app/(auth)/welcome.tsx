import { Link } from 'expo-router';
import { Button, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center gap-6 p-4">
          <View>
            <Text variant="display">Display - Welcome to the app</Text>
            <Text variant="h1">H1 - Welcome to the app</Text>
            <Text variant="h2">H2 - Welcome to the app</Text>
            <Text variant="h3">H3 - Welcome to the app</Text>
            <Text variant="body">Body - Welcome to the app</Text>
            <Text variant="caption">Caption - Welcome to the app</Text>
            <Text variant="button">Button - Welcome to the app</Text>
            <Text variant="input">Input - Welcome to the app</Text>
          </View>
          <Link href="/sign-in" asChild>
            <Button title="Sign In" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
