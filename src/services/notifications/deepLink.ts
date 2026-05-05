import type { Href } from 'expo-router';
import { router } from 'expo-router';

import { devWarn } from '@/utils/devLog';

/**
 * Paths that may be opened from notification payloads (`data.screen`).
 * Expand as you add routes; unknown values are ignored.
 */
const ALLOWED_NOTIFICATION_PATHS: ReadonlySet<string> = new Set([
  '/welcome',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/notifications-test',
  '/',
  '/profile',
  '/verify-email',
]);

/** Navigate from notification `content.data` if `screen` is allowlisted. */
export function navigateFromNotificationPayload(data: Record<string, unknown> | undefined): void {
  const screen = data?.screen;
  if (typeof screen !== 'string') return;

  if (!ALLOWED_NOTIFICATION_PATHS.has(screen)) {
    devWarn('notifications', 'Rejected deep link screen (not allowlisted):', screen);
    return;
  }

  try {
    router.push(screen as Href);
  } catch (e) {
    devWarn('notifications', 'router.push failed:', screen, e);
  }
}
