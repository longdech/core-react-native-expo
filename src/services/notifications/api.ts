import { client } from '../client';

export interface PushTokenPayload {
  token: string;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  appVersion?: string;
}

export const notificationApi = {
  // Đăng ký token mới
  registerToken: async (data: PushTokenPayload) => {
    const response = await client.post('/push-tokens/register', data);
    return response;
  },

  // Cập nhật token (refresh)
  updateToken: async (data: PushTokenPayload) => {
    const response = await client.put('/push-tokens/update', data);
    return response;
  },

  // Xóa token (logout)
  unregisterToken: async (token: string) => {
    const response = await client.delete('/push-tokens/unregister', { data: { token } });
    return response;
  },

  // Xác nhận token vẫn hoạt động (heartbeat)
  heartbeat: async (token: string) => {
    const response = await client.post('/push-tokens/heartbeat', { token });
    return response;
  },
};
