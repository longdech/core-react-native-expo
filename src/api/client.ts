import { ENV } from '@/constants/Env';
import {
  createServiceProvider,
  HttpClient,
  TokenManager,
  createQueryClient,
} from '@/external/bridge';

const tokenManager = new TokenManager({
  getAccessToken: () => {
    // TODO: Implement get access token logic
    return null;
  },
  executeRefreshToken: async () => {
    // TODO: Implement refresh token logic
    const res = await fetch('/api/auth/refresh');
    const data = await res.json();
    return { accessToken: data.token, refreshToken: data.refresh };
  },
  onRefreshTokenSuccess: (tokens) => {
    // TODO: Implement on refresh token success logic
  },
});

export const client = new HttpClient({
  baseURL: ENV.apiUrl ?? '',
  tokenManager,
  enableDeduplication: true,
  onError: (error) => {
    console.error(error);
  },
});

export const defineService = createServiceProvider(client);
export const queryClient = createQueryClient();
