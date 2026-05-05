import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useSocketEvent } from '@/services/socket/hooks';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ad' | 'info';
  isClosing: boolean;
}

export default function WelcomeScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useSocketEvent('fake-ad', (ad) => {
    addNotification({ ...ad, type: 'ad' });
  });

  useSocketEvent('new-notification', (notif) => {
    addNotification({ ...notif, type: 'info' });
  });

  const addNotification = (notif: any) => {
    const id = Date.now();
    setNotifications((prev) => [{ ...notif, id, isClosing: false }, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id.toString() ? { ...n, isClosing: true } : n)),
      );
    }, 8000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center gap-6 p-4">
          {notifications.map((notification) => (
            <View key={notification.id} className="flex-row items-center gap-2">
              <Text>{notification.message}</Text>
            </View>
          ))}
          <Link href="/sign-in" asChild>
            <Button title="Sign In" />
          </Link>
          <Link href="/notifications-test" asChild>
            <Button title="Notifications Test" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
