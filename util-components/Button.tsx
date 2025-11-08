import { Pressable, StyleSheet } from 'react-native';
import LinearGradientBackground from '../components/gradients/LinearBackgroundGradient';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import CustomText from './CustomText';

interface ButtonTypes {
  children?: any;
  onPress?: any;
  textColor?: string;
  backColor?: string;
  backColor1?: string;
  containerStyles?: {};
  textStyles?: {};
  disabled?: boolean;
}

function Button({
  children,
  onPress,
  textColor,
  backColor,
  backColor1,
  containerStyles,
  textStyles,
  disabled = false,
}: ButtonTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors, textColor, backColor);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, containerStyles]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradientBackground
        containerStyles={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, width: '100%' }}
        color1={backColor}
        color2={backColor1}
      >
        <CustomText variant="bold" style={[styles.buttonText, textStyles]}>
          {children}
        </CustomText>
      </LinearGradientBackground>
    </Pressable>
  );
}

export default Button;

function getStyles(colors: ThemeColors, textColor = 'black', backColor1 = colors.background1) {
  return StyleSheet.create({
    button: {
      borderRadius: 4,
      width: '100%',
      minHeight: 45,
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderTopColor: colors.borderColorHighlight,
      backgroundColor: backColor1 ? backColor1 : colors.background1,
      borderTopWidth: 0.6,
      padding: 0.5,
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
    },
  });
}
