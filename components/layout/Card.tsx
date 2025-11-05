import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import LinearGradientBackground from '../gradients/LinearBackgroundGradient';

interface CardPropTypes {
  children: ReactNode;
  cardStyles?: StyleProp<ViewStyle>;
  padding?: number;
}
function Card({ children, cardStyles, padding = 18 }: CardPropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.card, cardStyles]}>
      <LinearGradientBackground
        containerStyles={{ padding: padding, borderRadius: 4 }}
        color1={colors.cardBackground}
        color2={colors.cardBackground1}
      >
        {children}
      </LinearGradientBackground>
    </View>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.background1,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      margin: 10,
      flex: 1,
    },
  });
}

export default Card;
