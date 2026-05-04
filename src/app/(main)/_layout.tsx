import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
    </Stack>
  );
}
