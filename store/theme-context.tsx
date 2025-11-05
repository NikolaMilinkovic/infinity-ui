import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the structure of your color palette
export interface ThemeColors {
  defaultText: string;
  highlightText: string;
  whiteText: string;
  grayText: string;
  grayText1: string;
  primaryDark: string;
  secondaryDark: string;
  primaryLight: string;
  secondaryLight: string;
  highlight: string;
  highlight1: string;
  highlight2: string;
  secondaryHighlight: string;
  error: string;
  success: string;
  success1: string;
  warning: string;
  info: string;
  white: string;
  highlightBlue: string;
  successSecondary: string;

  // button
  buttonNormal1: string;
  buttonNormal2: string;
  buttonHighlight1: string;
  buttonHighlight2: string;
  blackWhite: string;

  // components
  buttonBackground: string;
  borders: string;
  navTextNormal: string;
  selectedNavText: string;
  selectedNavBackground: string;
  deleteButton: string;

  // dropdown
  dropdownSelectedBackground: string;
  dropdownSearchBackground: string;

  // nav stripe
  navBackground: string;
  navText: string;

  // tabs
  tabsBackground: string;
  tabsPressEffect: string;
  black: string;

  // card
  cardBackground1: string;
  cardBackground2: string;

  // icons
  iconColor: string;

  background: string;
  background1: string;
  background2: string;
  containerBackground: string;
  cardBackground: string;
  screenBackground: string;
  borderColor: string;
  borderColorHighlight: string;

  // product
  selectedProductBackground: string;
  selectedProductButtonBackground: string;
  outOfStockBackground: string;
  outOfStockButtonColor: string;
  outOfStockSelectedProductBackground: string;

  // checkbox
  checkboxCheckColor: string;

  // product group
  productGroupSelectedHighlight: string;
  productGroupBackground: string;
  productGroupTextColor: string;
}

// Define the context type
interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  colors: ThemeColors;
}

// Create context with proper default type
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [colors, setColors] = useState<ThemeColors>(getLightColors());

  useEffect(() => {
    switch (theme) {
      case 'light':
        setColors(getLightColors());
        break;
      case 'dark':
        setColors(getDarkColors());
        break;
      default:
        setColors(getLightColors());
        break;
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ colors, theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Hook for accessing colors
export const useThemeColors = (): ThemeColors => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeColors must be used within a ThemeProvider');
  return context.colors;
};

// Hook for accessing full theme (if needed)
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Light theme
function getLightColors(): ThemeColors {
  return {
    defaultText: '#313131ff',
    highlightText: '#000000',
    whiteText: '#F0F0F0',
    grayText: '#999999ff',
    grayText1: '#707070ff',
    primaryDark: '#012340',
    secondaryDark: '#024059',
    primaryLight: '#F0F0F0',
    secondaryLight: '#C5D5D9',
    highlight: '#ca9393ff',
    highlight1: '#b18080ff',
    highlight2: '#996e6eff',
    secondaryHighlight: '#fff4f4ff',
    error: '#CC6666',
    success: '#65CC65',
    success1: '#4d9b4dff',
    warning: '#CCCC66',
    info: '#001F54',
    white: '#F2F2F2',
    highlightBlue: '#6A5ACD',
    successSecondary: '#F0FAF0',

    // button
    buttonNormal1: '#ffffffff',
    buttonNormal2: '#f5f4f4ff',
    buttonHighlight1: '#ca9393ff',
    buttonHighlight2: '#996e6eff',
    blackWhite: '#FFFFFF',

    // components
    buttonBackground: '#F2F2F2',
    borders: '#012340',
    navTextNormal: '#012340',
    selectedNavText: '#F2F2F2',
    selectedNavBackground: '#012340',
    deleteButton: '#FF4D5E',

    // dropdown
    dropdownSelectedBackground: '#FFE4E4',
    dropdownSearchBackground: '#012340',

    // nav stripe
    navBackground: '#012340',
    navText: '#F2F2F2',

    // tabs
    tabsBackground: '#C5D5D9',
    tabsPressEffect: '#b0bdc1ff',
    black: '#000000',

    // card
    cardBackground1: '#ffffff',
    cardBackground2: '#fcfbfbff',

    // icons
    iconColor: '#012340',

    background: '#ffffff',
    background1: '#f3f2f2ff',
    background2: '#ebeaeaff',
    containerBackground: '#e4e2e2ff',
    cardBackground: '#ffffffff',
    screenBackground: '#F0F0F0',
    borderColor: '#C5D5D9',
    borderColorHighlight: '#d4e6ebff',

    // product
    selectedProductBackground: '#A3B9CC',
    selectedProductButtonBackground: '#93a6b8ff',
    outOfStockButtonColor: '#ebbebeff',
    outOfStockBackground: '#dfb4b4ff',
    outOfStockSelectedProductBackground: '#fff4f4ff',

    // checkbox
    checkboxCheckColor: '#215468ff',

    // product groups
    productGroupSelectedHighlight: '#024059',
    productGroupBackground: '#C5D5D9',
    productGroupTextColor: '#012340',
  };
}

// Dark theme
function getDarkColors(): ThemeColors {
  return {
    defaultText: '#cfcfcfff',
    highlightText: '#ebebebff',
    whiteText: '#F2F2F2',
    grayText: '#B3B3B3',
    grayText1: '#B3B3B3',
    primaryDark: '#000000ff',
    secondaryDark: '#1A1A1A',
    primaryLight: '#1A1A1A',
    secondaryLight: '#262626',
    highlight: '#72a186ff',
    highlight1: '#648d76ff',
    highlight2: '#486654ff',
    secondaryHighlight: '#fff4f4ff',
    error: '#CC6666',
    success: '#65CC65',
    success1: '#4d9b4dff',
    warning: '#CCCC66',
    info: '#64B5F6',
    white: '#F2F2F2',
    highlightBlue: '#8C9EFF',
    successSecondary: '#264D3A',

    // button
    buttonNormal2: '#0D0D0D',
    buttonNormal1: '#262626',
    buttonHighlight1: '#72a186ff',
    buttonHighlight2: '#486654ff',
    blackWhite: '#000000',

    // components
    buttonBackground: '#1A1A1A',
    borders: '#012340',
    navTextNormal: '#F2F2F2',
    selectedNavText: '#F2F2F2',
    selectedNavBackground: '#72a186ff',
    deleteButton: '#FF4D5E',

    // dropdown
    dropdownSelectedBackground: '#689b7eff',
    dropdownSearchBackground: '#161616ff',

    // nav stripe
    navBackground: '#0D0D0D',
    navText: '#F2F2F2',

    // tabs
    tabsBackground: '#C5D5D9',
    tabsPressEffect: '#b0bdc1ff',
    black: '#0D0D0D',

    // card
    cardBackground1: '#1A1A1A',
    cardBackground2: '#0D0D0D',

    // icons
    iconColor: '#B3B3B3',

    background: '#0D0D0D',
    background1: '#1A1A1A',
    background2: '#262626',
    cardBackground: '#0D0D0D',
    containerBackground: '#262626',
    screenBackground: '#333333',
    borderColor: '#4e4e4eff',
    borderColorHighlight: '#616161ff',

    // product
    selectedProductBackground: '#25332aff',
    selectedProductButtonBackground: '#314438ff',
    outOfStockBackground: '#422525ff',
    outOfStockButtonColor: '#532f2fff',
    outOfStockSelectedProductBackground: '#754444ff',

    // checkbox
    checkboxCheckColor: '#648d76ff',

    // product groups
    productGroupSelectedHighlight: '#648d76ff',
    productGroupBackground: '#262626',
    productGroupTextColor: '#8a8a8aff',
  };
}
