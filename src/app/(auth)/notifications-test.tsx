import React, { useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  cancelAllNotifications,
  scheduleDailyNotification,
  scheduleNotificationAfter,
  sendLocalNotification,
  useNotification,
} from '@/services/notifications';

export default function NotificationsTestScreen() {
  const {
    permissionGranted,
    expoPushToken,
    notification,
    getPushToken,
    isExpoGo,
    canUseRemotePush,
  } = useNotification();

  const [lastAction, setLastAction] = useState('');
  const [pushToken, setPushToken] = useState<string | null>(null);

  const handleGetPushToken = async () => {
    setLastAction('⏳ Getting push token...');
    const token = await getPushToken({ requestPermission: true });
    if (token) {
      setPushToken(token);
      setLastAction(`✅ Push token obtained: ${token.substring(0, 20)}...`);
    } else {
      setLastAction('❌ Failed to get push token');
    }
  };

  const showLastNotification = () => {
    if (notification) {
      Alert.alert(
        notification.request.content.title || 'No title',
        notification.request.content.body || 'No body',
      );
    } else {
      Alert.alert('No notification', 'No notification received yet');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Environment Info */}
      <View style={styles.card}>
        <Text style={styles.title}>📱 Environment</Text>
        <Text style={styles.status}>Mode: {isExpoGo ? 'Expo Go' : 'Development Build'}</Text>
        <Text style={styles.status}>
          Permission: {permissionGranted ? '✅ Granted' : '❌ Denied'}
        </Text>
        <Text style={styles.status}>
          Remote Push: {canUseRemotePush ? '✅ Available' : '❌ Not Available'}
        </Text>
        {expoPushToken && (
          <Text style={styles.token} numberOfLines={2}>
            Token: {expoPushToken}
          </Text>
        )}
        {pushToken && (
          <Text style={styles.tokenSuccess} numberOfLines={2}>
            ✅ Got Token: {pushToken.substring(0, 30)}...
          </Text>
        )}
        <Text style={styles.lastAction}>{lastAction}</Text>
      </View>

      {/* Local Notifications (Luôn hoạt động) */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>📢 Local Notifications</Text>
        <Text style={styles.infoText}>✅ Hoạt động trên Expo Go và Development Build</Text>

        <View style={styles.spacer} />
        <Button
          title="Send immediate notification"
          onPress={async () => {
            await sendLocalNotification('Hello!', 'This is a local notification');
            setLastAction('✅ Sent immediate local notification');
          }}
        />

        <View style={styles.spacer} />
        <Button
          title="Schedule in 5 seconds"
          onPress={async () => {
            await scheduleNotificationAfter('Reminder', '5 seconds have passed!', 5);
            setLastAction('⏰ Scheduled local notification in 5s');
          }}
        />

        <View style={styles.spacer} />
        <Button
          title="Schedule daily at 9:00 AM"
          onPress={async () => {
            await scheduleDailyNotification('Good morning!', 'Start your day with Staka!', 9, 0);
            setLastAction('📅 Scheduled daily local notification at 9:00');
          }}
        />

        <View style={styles.spacer} />
        <Button
          title="Cancel all scheduled"
          color="#FF6B6B"
          onPress={async () => {
            await cancelAllNotifications();
            setLastAction('🗑️ All notifications cancelled');
          }}
        />
      </View>

      {/* Remote Push Notifications (Chỉ development build) */}
      <View style={[styles.card, !canUseRemotePush && styles.disabledCard]}>
        <Text style={styles.subtitle}>☁️ Remote Push Notifications</Text>
        <Text style={[styles.infoText, !canUseRemotePush && styles.warningText]}>
          {canUseRemotePush
            ? '✅ Hoạt động trên Development Build'
            : '⚠️ KHÔNG hoạt động trên Expo Go. Cần development build.'}
        </Text>

        {!canUseRemotePush && (
          <View style={styles.warningBox}>
            <Text style={styles.warningBoxText}>💡 Để test remote push:</Text>
            <Text style={styles.warningBoxText}>1. Chạy: eas build --profile development</Text>
            <Text style={styles.warningBoxText}>2. Cài đặt app vừa build</Text>
            <Text style={styles.warningBoxText}>3. Quay lại test remote push</Text>
          </View>
        )}

        <View style={styles.spacer} />
        <Button
          title="Get Push Token"
          onPress={handleGetPushToken}
          disabled={!canUseRemotePush}
          color={canUseRemotePush ? '#4CAF50' : '#999'}
        />

        {canUseRemotePush && pushToken && (
          <>
            <View style={styles.spacer} />
            <Button
              title="Copy Token to Clipboard"
              onPress={async () => {
                // Cần cài đặt expo-clipboard
                // await Clipboard.setStringAsync(pushToken);
                setLastAction('📋 Token copied to clipboard');
              }}
            />
            <Text style={styles.hint}>
              Dùng token trên để gửi test qua https://expo.dev/notifications
            </Text>
          </>
        )}
      </View>

      {/* Received Notification */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>🔔 Last Received</Text>
        <Button title="Show last notification" onPress={showLastNotification} />
        {notification && (
          <Text style={styles.notificationInfo}>Last: {notification.request.content.title}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: '#F9F9F9',
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    marginBottom: 8,
  },
  token: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tokenSuccess: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  lastAction: {
    marginTop: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  notificationInfo: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
  },
  warningText: {
    color: '#FF9800',
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningBoxText: {
    fontSize: 12,
    color: '#E65100',
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  spacer: {
    height: 10,
  },
});
