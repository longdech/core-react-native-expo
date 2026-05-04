import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/tailwind';

export default function TabProfileScreen() {
  const { logout, isPending } = useAuth();
  const { colors } = useTheme();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center gap-6 p-4">
        <Text className="text-center text-primary">Welcome to the app!</Text>
        <Pressable
          className={cn(
            'h-12 flex-row items-center justify-center gap-2 rounded-[4px] border border-border bg-primary p-2',
            isPending && 'opacity-50',
          )}
          onPress={logout}
          disabled={isPending}
        >
          {isPending && <ActivityIndicator size="small" color={colors.primaryForeground} />}
          <Text className="text-primary-foreground text-center text-sm">
            {isPending ? 'Logging out...' : 'Logout'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
