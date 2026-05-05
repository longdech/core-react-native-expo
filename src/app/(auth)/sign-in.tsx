import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/tailwind';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function SignInScreen() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const { login, isPending } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  };

  const handleSignIn = () => {
    login(email, password)
      .then(() => {
        Alert.alert('Success', 'Sign in successful');
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'An unknown error occurred');
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4">
        <Pressable onPress={handleBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* TODO: Enable KeyboardAwareScrollView when run app at development mode and remove Scrollview */}
        {/* <KeyboardAwareScrollView
          bottomOffset={20}
          enabled={true}
          keyboardShouldPersistTaps="handled"
          disableScrollOnKeyboardHide={false}
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        > */}
        <ScrollView className="flex-1">
          <View className="flex-1 justify-center gap-6 p-4">
            <Text className="text-center text-primary">Sign In to your account</Text>
            <View className="gap-1">
              <Text className="text-sm">Email</Text>
              <TextInput
                className="h-12 rounded-[4px] border border-border p-2"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View className="gap-1">
              <View className="flex-row justify-between">
                <Text className="text-sm">Password</Text>
                <Link href="/forgot-password" asChild>
                  <Text className="text-sm">Forgot password?</Text>
                </Link>
              </View>
              <TextInput
                className="h-12 rounded-[4px] border border-border p-2"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-primary p-2"
              onPress={handleSignIn}
              disabled={isPending}
            >
              {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
              <Text
                className={cn(
                  'text-center text-sm text-primary-foreground',
                  isPending && 'opacity-50',
                )}
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </Text>
            </Pressable>
            <Text className="text-center text-sm">OR</Text>
            <Link href="/sign-up" asChild>
              <Pressable className="flex-row items-center justify-center gap-2">
                <Text className="text-center text-primary">Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
        {/* </KeyboardAwareScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
