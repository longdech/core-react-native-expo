import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/tailwind';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isPending } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  };

  const handleSignUp = () => {
    register(name, email, password)
      .then(() => {
        Alert.alert('Success', 'Sign up successful');
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
            <Text className="text-center text-primary">Sign Up to your account</Text>
            <View className="gap-1">
              <Text className="text-sm">Name</Text>
              <TextInput
                className="h-12 rounded-[4px] border border-border p-2"
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
            </View>
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
              <Text className="text-sm">Password</Text>
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
              onPress={handleSignUp}
              disabled={isPending}
            >
              {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
              <Text
                className={cn(
                  'text-primary-foreground text-center text-sm',
                  isPending && 'opacity-50',
                )}
              >
                {isPending ? 'Signing up...' : 'Sign Up'}
              </Text>
            </Pressable>
            <Link href="/sign-in" asChild>
              <Pressable className="flex-row items-center justify-center gap-2">
                <Text className="text-center text-primary">Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
        {/* </KeyboardAwareScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
