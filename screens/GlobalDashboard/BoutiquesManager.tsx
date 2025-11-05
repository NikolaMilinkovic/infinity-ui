import { Animated, StyleSheet } from 'react-native';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import AddBoutique from './BoutiquesManager/AddBoutique';

function BoutiquesManager() {
  const fadeAnimation = useFadeAnimation();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <AddBoutique />
    </Animated.View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
  });
}

export default BoutiquesManager;
