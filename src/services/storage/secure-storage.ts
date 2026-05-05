import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

import { devError, devLog } from '@/utils/dev-log';

const ENCRYPTION_KEY_STORAGE_KEY = 'app_mmkv_encryption_key';
const MMKV_INSTANCE_ID = 'app_secure_storage';

/**
 * Tạo hoặc lấy encryption key từ SecureStore
 */
async function getOrCreateEncryptionKey(): Promise<string> {
  try {
    // 1. Thử lấy key hiện có
    let encryptionKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE_KEY);

    if (encryptionKey) {
      devLog('storage', 'Loaded existing encryption key');
      return encryptionKey;
    }

    // 2. Tạo key mới (256-bit = 32 bytes)
    const randomBytes = new Uint8Array(32);

    // Dùng crypto.getRandomValues (hoặc fallback cho React Native cũ)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomBytes);
    } else {
      // Fallback cho môi trường không có Web Crypto API
      for (let i = 0; i < randomBytes.length; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }

    // Chuyển sang base64 thay vì hex để ngắn gọn hơn
    encryptionKey = btoa(String.fromCharCode(...randomBytes));

    // 3. Lưu key vào SecureStore
    await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, encryptionKey);
    devLog('storage', 'Generated and saved new encryption key');

    return encryptionKey;
  } catch (error) {
    devError('storage', 'Failed to manage encryption key', error);
    throw new Error('Unable to initialize secure storage');
  }
}

/**
 * Khởi tạo MMKV instance duy nhất (singleton)
 */
let mmkvInstance: ReturnType<typeof createMMKV> | null = null;

export async function initializeMMKV() {
  if (mmkvInstance) {
    return mmkvInstance;
  }

  const encryptionKey = await getOrCreateEncryptionKey();

  mmkvInstance = createMMKV({
    id: MMKV_INSTANCE_ID,
    encryptionKey: encryptionKey,
    encryptionType: 'AES-256',
  });

  devLog('storage', 'MMKV initialized with AES-256 encryption');
  return mmkvInstance;
}

/**
 * Lấy instance (dùng trong app)
 */
export async function getStorage() {
  if (!mmkvInstance) {
    return initializeMMKV();
  }
  return mmkvInstance;
}

/**
 * Xóa toàn bộ dữ liệu (logout, reset app)
 */
export async function resetStorage() {
  try {
    if (mmkvInstance) {
      mmkvInstance.clearAll();
      mmkvInstance = null;
    }

    await SecureStore.deleteItemAsync(ENCRYPTION_KEY_STORAGE_KEY);
    devLog('storage', 'Storage and encryption key cleared');
  } catch (error) {
    devError('storage', 'Failed to reset storage', error);
  }
}
