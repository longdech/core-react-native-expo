import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { queryClient } from '@/services/client';
import { SocketProvider } from '@/services/socket/context';

import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SocketProvider>
  );
};
