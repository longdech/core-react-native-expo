import { getStorage } from './secure-storage';
import type { StorageKey } from './storage-keys';

class StorageService {
  private static instance: StorageService;
  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // ============ Set ============
  async setString(key: StorageKey, value: string): Promise<void> {
    const storage = await getStorage();
    storage.set(key, value);
  }

  async setNumber(key: StorageKey, value: number): Promise<void> {
    const storage = await getStorage();
    storage.set(key, value);
  }

  async setBoolean(key: StorageKey, value: boolean): Promise<void> {
    const storage = await getStorage();
    storage.set(key, value);
  }

  async setObject<T extends object>(key: StorageKey, value: T): Promise<void> {
    const storage = await getStorage();
    storage.set(key, JSON.stringify(value));
  }

  // ============ Get ============
  async getString(key: StorageKey, defaultValue?: string): Promise<string | undefined> {
    const storage = await getStorage();
    const value = storage.getString(key);
    return value ?? defaultValue;
  }

  async getNumber(key: StorageKey, defaultValue?: number): Promise<number | undefined> {
    const storage = await getStorage();
    const value = storage.getNumber(key);
    return value ?? defaultValue;
  }

  async getBoolean(key: StorageKey, defaultValue?: boolean): Promise<boolean | undefined> {
    const storage = await getStorage();
    const value = storage.getBoolean(key);
    return value ?? defaultValue;
  }

  async getObject<T extends object>(key: StorageKey): Promise<T | null> {
    const storage = await getStorage();
    const json = storage.getString(key);
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  // ============ Utils ============
  async contains(key: StorageKey): Promise<boolean> {
    const storage = await getStorage();
    return storage.contains(key);
  }

  async remove(key: StorageKey): Promise<void> {
    const storage = await getStorage();
    storage.remove(key);
  }

  async clearAll(): Promise<void> {
    const storage = await getStorage();
    storage.clearAll();
  }

  async getAllKeys(): Promise<string[]> {
    const storage = await getStorage();
    return storage.getAllKeys();
  }

  async getSize(): Promise<number> {
    const storage = await getStorage();
    return storage.size;
  }

  // ============ Batch operations ============
  async setMultiple(items: { key: StorageKey; value: any }[]): Promise<void> {
    const storage = await getStorage();
    for (const { key, value } of items) {
      storage.set(key, value);
    }
  }

  async getMultiple(keys: StorageKey[]): Promise<Record<string, any>> {
    const storage = await getStorage();
    const result: Record<string, any> = {};
    for (const key of keys) {
      result[key] = storage.getString(key);
    }
    return result;
  }
}

export const storageService = StorageService.getInstance();
