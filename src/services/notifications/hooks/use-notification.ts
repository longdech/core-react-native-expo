import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { devError, devLog, devWarn } from '@/utils/devLog';

import { notificationApi } from '../api';
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

const TOKEN_STORAGE_KEY = '@push_token';
const DEVICE_ID_KEY = '@device_id';

// Tạo device ID duy nhất (chỉ 1 lần)
const getDeviceId = async (): Promise<string> => {
  // let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  // if (!deviceId) {
  //   deviceId = `${Device.osName || Platform.OS}_${Constants.deviceId || Date.now()}`;
  //   await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  // }
  // return deviceId;
  return new Promise((resolve) => {
    resolve(`${Device.osName || Platform.OS}_${Constants.deviceId || Date.now()}`);
  });
};

const getDeviceInfo = async () => ({
  deviceId: await getDeviceId(),
  deviceName: Device.deviceName || 'Unknown device',
  platform: Platform.OS,
  appVersion: Constants.expoConfig?.version,
});

export const useNotificationSync = () => {
  const { getPushToken, expoPushToken, requestPermissions, canUseRemotePush } = useNotifications();
  // const { isAuthenticated, user } = useAuth();
  const isSyncingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  // Lấy token đã lưu trong storage
  const getStoredToken = useCallback(async (): Promise<string | null> => {
    // return await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
    return lastTokenRef.current;
  }, []);

  // Lưu token vào storage
  const storeToken = useCallback(async (token: string) => {
    // await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    lastTokenRef.current = token;
  }, []);

  // Xóa token khỏi storage
  const clearStoredToken = useCallback(async () => {
    // await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    lastTokenRef.current = null;
  }, []);

  // Gửi token lên backend
  const syncTokenToBackend = useCallback(
    async (token: string, action: 'register' | 'update' = 'register') => {
      // if (!isAuthenticated || !user) {
      //   devLog('notification-sync', 'User not authenticated, skip sync');
      //   return false;
      // }

      try {
        const deviceInfo = await getDeviceInfo();
        const payload = { token, ...deviceInfo };

        if (action === 'register') {
          await notificationApi.registerToken(payload);
          devLog('notification-sync', 'Token registered to backend');
        } else {
          await notificationApi.updateToken(payload);
          devLog('notification-sync', 'Token updated on backend');
        }
        return true;
      } catch (error) {
        devError('notification-sync', 'Failed to sync token:', error);
        return false;
      }
    },
    [],
  );

  // Core logic: kiểm tra và sync token
  const checkAndSyncToken = useCallback(async () => {
    // Không sync nếu đang sync hoặc không thể dùng remote push
    if (isSyncingRef.current || !canUseRemotePush) return;

    isSyncingRef.current = true;

    try {
      // 1. Đảm bảo có permission
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        devLog('notification-sync', 'No permission, skip sync');
        return;
      }

      // 2. Lấy token hiện tại từ thiết bị
      const currentToken = await getPushToken({ requestPermission: false });
      if (!currentToken) {
        devLog('notification-sync', 'No current token available');
        return;
      }

      // 3. Lấy token đã lưu trong storage
      const storedToken = await getStoredToken();

      // 4. So sánh và quyết định
      if (currentToken !== storedToken) {
        devLog('notification-sync', `Token changed! New: ${currentToken}, Old: ${storedToken}`);

        // Gửi lên backend với action thích hợp
        const action = storedToken ? 'update' : 'register';
        const synced = await syncTokenToBackend(currentToken, action);

        if (synced) {
          await storeToken(currentToken);
          devLog('notification-sync', 'Token synced and stored successfully');
        }
      } else {
        // Token không đổi, nhưng vẫn gửi heartbeat để backend biết device còn hoạt động
        if (storedToken) {
          await notificationApi.heartbeat(storedToken);
          devLog('notification-sync', 'Heartbeat sent');
        }
      }
    } catch (error) {
      devError('notification-sync', 'checkAndSyncToken failed:', error);
    } finally {
      isSyncingRef.current = false;
    }
  }, [
    canUseRemotePush,
    requestPermissions,
    getPushToken,
    getStoredToken,
    storeToken,
    syncTokenToBackend,
    // isAuthenticated,
  ]);

  // Lắng nghe token thay đổi từ Expo
  useEffect(() => {
    if (!canUseRemotePush) return;

    // Đăng ký listener cho sự kiện token thay đổi
    const subscription = Notifications.addPushTokenListener(async (token) => {
      devLog('notification-sync', 'Push token changed event received');

      // Token thay đổi bất thường, cần sync ngay
      const currentToken = token.data;
      const storedToken = await getStoredToken();

      if (currentToken !== storedToken) {
        const synced = await syncTokenToBackend(currentToken, storedToken ? 'update' : 'register');
        if (synced) {
          await storeToken(currentToken);
        }
      }
    });

    return () => subscription.remove();
  }, [canUseRemotePush, syncTokenToBackend, storeToken, getStoredToken]);

  // Khi user login hoặc app focus, kiểm tra và sync
  // useEffect(() => {
  //   if (isAuthenticated && canUseRemotePush) {
  //     checkAndSyncToken();
  //   }
  // }, [isAuthenticated, canUseRemotePush, checkAndSyncToken]);

  // Xóa token khi logout (gọi từ auth context)
  const unregisterToken = useCallback(async () => {
    const token = await getStoredToken();
    if (token) {
      await notificationApi.unregisterToken(token);
      await clearStoredToken();
      devLog('notification-sync', 'Token unregistered on logout');
    }
  }, [getStoredToken, clearStoredToken]);

  return {
    checkAndSyncToken,
    unregisterToken,
    isRemoteAvailable: canUseRemotePush,
  };
};
