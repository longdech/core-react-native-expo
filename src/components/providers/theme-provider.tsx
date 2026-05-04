import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { createContext, type ReactNode, useState } from 'react';
import { View } from 'react-native';

import { COLORS, type ColorScheme, THEMES } from '@/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export type ThemeContextType = {
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: ColorScheme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colors: COLORS.light,
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
        colors: COLORS[currentTheme],
        toggleTheme,
      }}
    >
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <View style={THEMES[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
