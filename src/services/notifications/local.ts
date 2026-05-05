import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { devLog } from '@/utils/dev-log';

/**
 * Gửi local notification ngay lập tức
 */
export const sendLocalNotification = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: Platform.OS === 'android' ? 'default' : undefined,
    },
    trigger: null, // null = gửi ngay lập tức
  });
  devLog('notifications', 'local sent:', title);
};

/**
 * Schedule local notification sau X giây
 */
export const scheduleNotificationAfter = async (
  title: string,
  body: string,
  seconds: number,
  data?: any,
) => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: Platform.OS === 'android' ? 'default' : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: seconds,
    },
  });
  devLog('notifications', 'scheduled in', seconds, 's:', identifier);
  return identifier;
};

/**
 * Schedule local notification hàng ngày
 */
export const scheduleDailyNotification = async (
  title: string,
  body: string,
  hour: number,
  minute: number,
  data?: any,
) => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: Platform.OS === 'android' ? 'default' : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  devLog('notifications', 'daily scheduled', `${hour}:${minute}`, identifier);
  return identifier;
};

/**
 * Cancel tất cả scheduled notifications
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  devLog('notifications', 'all scheduled cancelled');
};
