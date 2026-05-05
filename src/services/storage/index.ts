export { getStorage, initializeMMKV, resetStorage } from './secure-storage';
export type { StorageKey } from './storage-keys';
export { StorageKeys } from './storage-keys';
export { storageService } from './storage-service';

// Hooks
export {
  useStorageBoolean,
  useStorageHas,
  useStorageNumber,
  useStorageObject,
  useStorageString,
} from './hooks/use-storage';
