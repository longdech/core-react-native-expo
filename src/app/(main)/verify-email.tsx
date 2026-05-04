import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/tailwind';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const { verifyEmail, isPending, user, logout } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const handleVerifyEmail = () => {
    verifyEmail(user?.email!, code)
      .then(() => {
        Alert.alert('Success', 'Email verified successfully');
        router.replace('/');
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'Failed to verify email');
      });
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center gap-6 p-4">
          <Text className="text-center text-primary">Verify Email</Text>
          <Text className="text-center text-sm">Enter the code sent to your email</Text>
          <TextInput
            className="h-12 rounded-[4px] border border-border p-2"
            placeholder="Enter the code sent to your email"
            value={code}
            onChangeText={setCode}
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
                isPending && 'opacity-50',
              )}
            >
              {isPending ? 'Verifying email...' : 'Verify Email'}
            </Text>
          </Pressable>
          <Pressable
            className={cn(
              'h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-destructive p-2',
              isPending && 'opacity-50',
            )}
            onPress={logout}
            disabled={isPending}
          >
            {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
            <Text className="text-destructive-foreground text-center text-sm">
              {isPending ? 'Logging out...' : 'Logout'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
