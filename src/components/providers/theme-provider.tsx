import { createContext, type ReactNode, useState } from 'react';

import { View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { colorScheme } from 'nativewind';

import Colors from '@/constants/Colors';
import { themes } from '@/lib/themes';

interface ThemeProviderProps {
  children: ReactNode;
}

export type ThemeContextType = {
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colors: Colors.light,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    colorScheme.set(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDark: currentTheme === 'dark',
        colors: Colors[currentTheme],
        toggleTheme,
      }}
    >
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <View style={themes[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
