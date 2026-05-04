import { GoogleSansText } from '@/components/ui/Text';
import { Link } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center gap-6 p-4">
        <Text className="text-center text-primary">Welcome</Text>
        <GoogleSansText>Welcome to the app</GoogleSansText>
        <Link href="/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
      </View>
    </SafeAreaView>
  );
}
