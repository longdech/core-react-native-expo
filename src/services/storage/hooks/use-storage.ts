import { useCallback, useEffect, useState } from 'react';

import type { StorageKey } from '../storage-keys';
import { storageService } from '../storage-service';

/**
 * Hook cho String
 */
export function useStorageString(key: StorageKey) {
  const [value, setValue] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const val = await storageService.getString(key);
      setValue(val);
      setLoading(false);
    };
    load();
  }, [key]);

  const update = useCallback(
    async (newValue: string) => {
      await storageService.setString(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return { value, loading, update };
}

/**
 * Hook cho Number
 */
export function useStorageNumber(key: StorageKey) {
  const [value, setValue] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const val = await storageService.getNumber(key);
      setValue(val);
      setLoading(false);
    };
    load();
  }, [key]);

  const update = useCallback(
    async (newValue: number) => {
      await storageService.setNumber(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return { value, loading, update };
}

/**
 * Hook cho Boolean
 */
export function useStorageBoolean(key: StorageKey) {
  const [value, setValue] = useState<boolean | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const val = await storageService.getBoolean(key);
      setValue(val);
      setLoading(false);
    };
    load();
  }, [key]);

  const update = useCallback(
    async (newValue: boolean) => {
      await storageService.setBoolean(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return { value, loading, update };
}

/**
 * Hook cho Object
 */
export function useStorageObject<T extends object>(key: StorageKey) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const val = await storageService.getObject<T>(key);
      setValue(val);
      setLoading(false);
    };
    load();
  }, [key]);

  const update = useCallback(
    async (newValue: T) => {
      await storageService.setObject(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return { value, loading, update };
}

/**
 * Hook check tồn tại
 */
export function useStorageHas(key: StorageKey) {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const has = await storageService.contains(key);
      setExists(has);
      setLoading(false);
    };
    check();
  }, [key]);

  return { exists, loading };
}
