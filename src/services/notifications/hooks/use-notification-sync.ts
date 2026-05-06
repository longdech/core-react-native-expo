import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { StorageKeys, storageService } from '@/services/storage';
import { devError, devLog } from '@/utils/dev-log';

import { notificationApi } from '../api';
import { useNotifications } from './use-notification';

// Tạo device ID duy nhất (chỉ 1 lần)
const getDeviceId = async (): Promise<string> => {
  let deviceId = await storageService.getString(StorageKeys.DEVICE_ID);
  if (!deviceId) {
    deviceId = `${Device.osName || Platform.OS}_${Constants.deviceId || Date.now()}`;
    await storageService.setString(StorageKeys.DEVICE_ID, deviceId);
  }
  return deviceId;
};

const getDeviceInfo = async () => ({
  deviceId: await getDeviceId(),
  deviceName: Device.deviceName || 'Unknown device',
  platform: Platform.OS,
  appVersion: Constants.expoConfig?.version,
});

export const useNotificationSync = () => {
  const { getPushToken, requestPermissions, canUseRemotePush } = useNotifications();
  const { isAuthenticated, user } = useAuth();
  const isSyncingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  // Lấy token đã lưu trong storage
  const getStoredToken = useCallback(async (): Promise<string | null> => {
    return (await storageService.getString(StorageKeys.PUSH_TOKEN)) ?? null;
  }, []);

  // Lưu token vào storage
  const storeToken = useCallback(async (token: string) => {
    await storageService.setString(StorageKeys.PUSH_TOKEN, token);
    lastTokenRef.current = token;
  }, []);

  // Xóa token khỏi storage
  const clearStoredToken = useCallback(async () => {
    await storageService.remove(StorageKeys.PUSH_TOKEN);
    lastTokenRef.current = null;
  }, []);

  // Gửi token lên backend
  const syncTokenToBackend = useCallback(
    async (token: string, action: 'register' | 'update' = 'register') => {
      if (!isAuthenticated || !user) {
        devLog('notification-sync', 'User not authenticated, skip sync');
        return false;
      }

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
    [isAuthenticated, user],
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
        if (storedToken && isAuthenticated) {
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
    isAuthenticated,
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
  useEffect(() => {
    if (isAuthenticated && canUseRemotePush) {
      checkAndSyncToken();
    }
  }, [isAuthenticated, canUseRemotePush, checkAndSyncToken]);

  // Xóa token khi logout (gọi từ auth context)
  const unregisterToken = useCallback(async () => {
    const token = await getStoredToken();
    if (token && isAuthenticated) {
      await notificationApi.unregisterToken(token);
      // TODO: Keep token if want sent notification to this device
      // await clearStoredToken();
      devLog('notification-sync', 'Token unregistered on logout');
    }
  }, [isAuthenticated, getStoredToken]);

  return {
    checkAndSyncToken,
    unregisterToken,
    isRemoteAvailable: canUseRemotePush,
  };
};
