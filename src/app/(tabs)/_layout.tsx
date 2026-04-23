import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
        }}
      />
    </Tabs>
  );
}
