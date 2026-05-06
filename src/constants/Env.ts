import { z } from 'zod';

const EnvSchema = z.object({
  appMode: z.enum(['development', 'production', 'testing']).optional().default('development'),
  apiUrl: z.url().optional(),
  apiSocketUrl: z.url().optional(),
  serverIp: z.string().optional(),
  serverPort: z.string().optional(),
  firebaseApiKey: z.string().optional(),
  firebaseAuthDomain: z.string().optional(),
  firebaseDatabaseURL: z.string().optional(),
  firebaseProjectId: z.string().optional(),
  firebaseStorageBucket: z.string().optional(),
  firebaseMessagingSenderId: z.string().optional(),
  firebaseAppId: z.string().optional(),
});

/**
 * Validate environment variables
 * @param env environment variables
 * @returns validated environment variables
 */
const validator = (env: Record<string, unknown>) => {
  const _env = EnvSchema.safeParse(env);
  if (!_env.success) {
    throw new Error(
      'Invalid environment variables:\n' +
        _env.error.issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n'),
    );
  }
  return _env.data;
};

/**
 * Environment variables
 */
export const ENV = validator({
  appMode: process.env.EXPO_PUBLIC_APP_MODE,
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  apiSocketUrl: process.env.EXPO_PUBLIC_API_SOCKET_URL,
  serverIp: process.env.EXPO_PUBLIC_SERVER_IP,
  serverPort: process.env.EXPO_PUBLIC_SERVER_PORT,
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseDatabaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

export type EnvType = z.infer<typeof EnvSchema>;
export default ENV;
