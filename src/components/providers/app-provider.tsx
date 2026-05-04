import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { queryClient } from '@/api/client';

import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
