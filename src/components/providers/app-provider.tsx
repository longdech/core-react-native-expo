import { ThemeProvider } from './theme-provider';
import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
