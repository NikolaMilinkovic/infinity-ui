import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create the ThemeContext
const ThemeContext = createContext({});

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  const colors = theme === 'light' 
    ? {
      defaultText: '#000000',
      whiteText: '#F0F0F0',

      // Dark colors
      primaryDark: '#012340',
      secondaryDark: '#024059',

      // Light colors
      primaryLight: '#F0F0F0',
      secondaryLight: '#C5D5D9',
      highlight: '#C28E8E',
      secondaryHighlight: '#FFE4E4',

      // Error red
      error: '#DC143C',
      success: '#218838',
      warning: '#FFB74D',
      info: '#001F54',
      white: '#FFFFFF',
      highlightBlue: '#6A5ACD',
      successSecondary: '#F0FAF0',
      }
    : {
        defaultText: '#FFFFFF',
        primary: '#012340',
        highlight: '#6A5ACD',
      };

  return (
    <ThemeContext.Provider value={{ colors, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme
export const useThemeColors = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeColors must be used within a ThemeProvider');
  return context;
};
