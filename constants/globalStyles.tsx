import { Platform, StyleSheet } from 'react-native';
import { Colors } from './colors';

export const globalStyles = StyleSheet.create({
  // SHADOWS / ELEVATIONS
  elevation_1: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryDark,
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
        shadowColor: Colors.primaryDark,
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
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
  },
});
