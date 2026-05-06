import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
// import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { devError, devLog, devWarn } from '@/utils/dev-log';

import { createNotificationChannels } from '../config';
import { navigateFromNotificationPayload } from '../deepLink';

export type GetPushTokenOptions = {
  /**
   * When true, may show the system permission dialog if not already granted.
   * Default false: only reads token if permission was granted earlier (e.g. after mount `requestPermissions`).
   */
  requestPermission?: boolean;
};

export const useNotifications = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const isDevelopmentBuild = !isExpoGo && __DEV__;
  const canUseRemotePush = !isExpoGo;

  const requestPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await createNotificationChannels();
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === 'granted';
      setPermissionGranted(granted);

      if (!granted) {
        devWarn('notifications', 'Permission not granted');
      }

      return granted;
    } catch (error) {
      devError('notifications', 'requestPermissions failed:', error);
      return false;
    }
  }, []);

  const getPushToken = useCallback(
    async (options: GetPushTokenOptions = {}) => {
      const { requestPermission = false } = options;

      if (isExpoGo) {
        devWarn(
          'notifications',
          'Remote push unavailable in Expo Go; use an EAS development build.',
        );
        return null;
      }

      let granted = (await Notifications.getPermissionsAsync()).status === 'granted';
      if (!granted && requestPermission) {
        granted = await requestPermissions();
      }

      if (!granted) {
        devWarn('notifications', 'getPushToken skipped: no notification permission');
        return null;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
          devError(
            'notifications',
            'Missing EAS projectId (extra.eas.projectId). Run eas init / build:configure.',
          );
          return null;
        }

        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        setExpoPushToken(token.data);
        devLog('notifications', 'Expo push token registered');
        return token.data;
      } catch (error) {
        devError('notifications', 'getPushToken failed:', error);
        return null;
      }
    },
    [isExpoGo, requestPermissions],
  );

  useEffect(() => {
    devLog(
      'notifications',
      `env: expoGo=${isExpoGo} devBuild=${isDevelopmentBuild} remotePush=${canUseRemotePush}`,
    );

    requestPermissions();

    const notificationListener = Notifications.addNotificationReceivedListener((n) => {
      devLog('notifications', 'received:', n.request.content.title ?? '(no title)');
      setNotification(n);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      devLog(
        'notifications',
        'response tap:',
        response.notification.request.content.title,
        response.actionIdentifier,
      );

      const data = response.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      navigateFromNotificationPayload(data);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
    // listeners + env constants are intentionally mount-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    permissionGranted,
    expoPushToken,
    notification,
    requestPermissions,
    getPushToken,
    isExpoGo,
    canUseRemotePush,
    isDevelopmentBuild,
  };
};
