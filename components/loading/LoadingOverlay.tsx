import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { ThemeColors, useTheme, useThemeColors } from '../../store/theme-context';

interface LoadingOverlayTypes {
  message?: string;
}
function LoadingOverlay({ message }: LoadingOverlayTypes) {
  const colors = useThemeColors();
  const themeContext = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.rootContainer}>
      {themeContext.theme === 'light' && <Image source={require('../../assets/infinity.png')} style={styles.image} />}
      {themeContext.theme === 'dark' && (
        <Image source={require('../../assets/infinity-white.png')} style={styles.image} />
      )}
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color={colors.defaultText} />
    </View>
  );
}

export default LoadingOverlay;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    rootContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: colors.background,
    },
    message: {
      fontSize: 16,
      marginBottom: 12,
      color: colors.defaultText,
    },
    image: {
      maxHeight: 140,
      aspectRatio: 16 / 9,
      resizeMode: 'contain',
      marginBottom: 24,
    },
  });
}
