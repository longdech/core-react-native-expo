import { Link } from 'expo-router';
import { Button, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BeVietnamProText, GoogleSansText } from '@/components/ui';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center gap-6 p-4">
          <GoogleSansText size="base">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="h1">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="h2">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="h3">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="body">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="caption">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="button">Welcome to the app</GoogleSansText>
          <GoogleSansText variant="input">Welcome to the app</GoogleSansText>
          <BeVietnamProText size="base">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="h1">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="h2">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="h3">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="body">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="caption">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="button">Welcome to the app</BeVietnamProText>
          <BeVietnamProText variant="input">Welcome to the app</BeVietnamProText>
          <Text className="font-beVietnamPro text-3xl">Welcome to the app</Text>
          <Link href="/sign-in" asChild>
            <Button title="Sign In" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
