/** Dev-only console helpers; noop in production. */

/* eslint-disable no-console */

export function devLog(scope: string, ...args: unknown[]): void {
  if (!__DEV__) return;
  console.log(`[${scope}]`, ...args);
}

export function devWarn(scope: string, ...args: unknown[]): void {
  if (!__DEV__) return;
  console.warn(`[${scope}]`, ...args);
}

export function devError(scope: string, ...args: unknown[]): void {
  if (!__DEV__) return;
  console.error(`[${scope}]`, ...args);
}
