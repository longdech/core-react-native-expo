import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/tailwind';

enum Step {
  FORGOT_PASSWORD = 'forgot-password',
  VERIFY_EMAIL = 'verify-email',
  ENTER_NEW_PASSWORD = 'enter-new-password',
}

export default function ForgotPasswordScreen() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.FORGOT_PASSWORD);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const { forgotPassword, resetPassword, isPending } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  };

  const handleForgotPassword = () => {
    forgotPassword(email)
      .then(() => {
        setCurrentStep(Step.VERIFY_EMAIL);
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'Failed to send reset password email');
      });
  };

  const handleVerifyEmail = () => {
    setCurrentStep(Step.ENTER_NEW_PASSWORD);
  };

  const handleResetPassword = () => {
    resetPassword(email, password, confirmPassword)
      .then(() => {
        Alert.alert('Success', 'Password reset successful', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/sign-in');
            },
          },
        ]);
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'Failed to reset password');
      });
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4">
        <Pressable onPress={handleBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
      <View className="flex-1 justify-center gap-6 p-4">
        {currentStep !== Step.FORGOT_PASSWORD && (
          <Pressable
            onPress={() =>
              setCurrentStep(
                currentStep === Step.VERIFY_EMAIL
                  ? Step.FORGOT_PASSWORD
                  : currentStep === Step.ENTER_NEW_PASSWORD
                    ? Step.VERIFY_EMAIL
                    : Step.FORGOT_PASSWORD,
              )
            }
          >
            <Text>Previous Step</Text>
          </Pressable>
        )}
        {currentStep === Step.FORGOT_PASSWORD && (
          <View className="gap-2">
            <Text className="text-center text-primary">Forgot Password</Text>
            <Text className="text-center text-sm">Enter your email to reset password</Text>
            <TextInput
              className="h-12 rounded-[4px] border border-border p-2"
              placeholder="Enter your email to reset password"
              value={email}
              onChangeText={setEmail}
            />
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-primary p-2"
              onPress={handleForgotPassword}
              disabled={isPending}
            >
              {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
              <Text
                className={cn(
                  'text-primary-foreground text-center text-sm',
                  isPending && 'opacity-50',
                )}
              >
                {isPending ? 'Sending reset password email...' : 'Send Reset Password Email'}
              </Text>
            </Pressable>
          </View>
        )}
        {currentStep === Step.VERIFY_EMAIL && (
          <>
            <Text className="text-center text-primary">Verify Email</Text>
            <TextInput
              className="h-12 rounded-[4px] border border-border p-2"
              placeholder="Enter the code sent to your email"
              value={token}
              onChangeText={setToken}
            />
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-primary p-2"
              onPress={handleVerifyEmail}
              disabled={isPending}
            >
              {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
              <Text
                className={cn(
                  'text-primary-foreground text-center text-sm',
                  isPending || (!token && 'opacity-50'),
                )}
              >
                {isPending ? 'Verifying email...' : 'Verify Email'}
              </Text>
            </Pressable>
          </>
        )}
        {currentStep === Step.ENTER_NEW_PASSWORD && (
          <>
            <Text className="text-center text-primary">Enter New Password</Text>
            <TextInput
              className="h-12 rounded-[4px] border border-border p-2"
              placeholder="Enter your new password"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              className="h-12 rounded-[4px] border border-border p-2"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable
              className="h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-primary p-2"
              onPress={handleResetPassword}
              disabled={isPending}
            >
              {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
              <Text
                className={cn(
                  'text-primary-foreground text-center text-sm',
                  isPending || (!password && 'opacity-50'),
                )}
              >
                {isPending ? 'Resetting password...' : 'Reset Password'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
