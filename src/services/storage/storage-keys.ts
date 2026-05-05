export const StorageKeys = {
  // Device
  DEVICE_ID: '@device/id',

  // Auth
  AUTH_TOKEN: '@auth/token',
  AUTH_USER_ID: '@auth/userId',
  AUTH_REFRESH_TOKEN: '@auth/refreshToken',

  // User
  USER_PROFILE: '@user/profile',
  USER_SETTINGS: '@user/settings',
  USER_PREFERENCES: '@user/preferences',

  // App
  APP_THEME: '@app/theme',
  APP_LANGUAGE: '@app/language',
  APP_FIRST_LAUNCH: '@app/firstLaunch',

  // Cache
  CACHE_POSTS: '@cache/posts',
  CACHE_LAST_SYNC: '@cache/lastSync',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
