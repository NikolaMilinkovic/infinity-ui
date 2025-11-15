import type { TextStyle, ViewStyle } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { useThemeColors } from '../store/theme-context';

export interface GlobalStyles {
  // Shadows / Elevation
  elevation_1: ViewStyle;
  elevation_2: ViewStyle;

  // Borders
  border: ViewStyle;

  // Fonts
  fontRegular: TextStyle;
  fontMedium: TextStyle;
  fontBold: TextStyle;

  // Text
  textRegular: TextStyle;
  textBold: TextStyle;
  header: TextStyle;
}

export const useGlobalStyles = () => {
  const colors = useThemeColors();
  return StyleSheet.create({
    // SHADOWS / ELEVATIONS
    elevation_1: {
      ...Platform.select({
        ios: {
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.14,
          shadowRadius: 1.5,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    elevation_2: {
      ...Platform.select({
        ios: {
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },

    // BORDERS
    border: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
    },

    // FONTS
    fontRegular: {
      fontFamily: 'HelveticaNeue-Light',
    },
    fontMedium: {
      fontFamily: 'HelveticaNeue-Medium',
    },
    fontBold: {
      fontFamily: 'HelveticaNeue-Bold',
    },

    // TEXT
    textRegular: {
      fontFamily: 'HelveticaNeue-Light',
      lineHeight: 18,
      paddingTop: 2,
      color: colors.defaultText,
    },
    textMedium: {
      fontFamily: 'HelveticaNeue-Medium',
      lineHeight: 18,
      color: colors.defaultText,
    },
    textBold: {
      fontFamily: 'HelveticaNeue-Bold',
      color: colors.defaultText,
      paddingTop: 2,
      lineHeight: 18,
    },
    header: {
      fontFamily: 'HelveticaNeue-Bold',
      color: colors.defaultText,
      lineHeight: 16,
    },
  });
};
