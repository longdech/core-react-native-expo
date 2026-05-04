import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { useAuth } from '@/hooks/use-auth';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user?.emailVerified) {
    return <Redirect href="/verify-email" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
