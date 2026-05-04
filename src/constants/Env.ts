import { z } from 'zod';

const EnvSchema = z.object({
  appMode: z.enum(['development', 'production', 'testing']).optional().default('development'),
  apiUrl: z.url().optional(),
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
});

export type EnvType = z.infer<typeof EnvSchema>;
export default ENV;
