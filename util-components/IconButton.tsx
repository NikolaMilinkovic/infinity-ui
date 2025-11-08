import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import LinearGradientBackground from '../components/gradients/LinearBackgroundGradient';
import { ThemeColors, useThemeColors } from '../store/theme-context';
type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
type FontAwesomeIconNames = keyof typeof FontAwesome6.glyphMap;

interface IconButtonProps {
  icon?: MaterialIconNames | FontAwesomeIconNames;
  color?: string;
  onPress: () => void;
  size?: number;
  text?: string;
  style?: object;
  textStyle?: object;
  iconStyle?: object;
  pressedStyles?: object;
  iconsLibrary?: 'MaterialIcons' | 'FontAwesome6';
  backColor: string;
  backColor1: string;
  direction?: 'row' | 'column';
}

// file-export
function IconButton({
  icon,
  color,
  onPress,
  text,
  style,
  textStyle,
  iconStyle,
  size,
  pressedStyles,
  iconsLibrary = 'MaterialIcons',
  backColor,
  backColor1,
  direction,
}: IconButtonProps) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && (pressedStyles || styles.pressed), { minHeight: 44 }, style]}
      >
        <LinearGradientBackground
          containerStyles={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            width: '100%',
            flexDirection: direction,
            gap: direction === 'row' ? 6 : 0,
          }}
          color1={backColor}
          color2={backColor1}
        >
          {icon && iconsLibrary === 'MaterialIcons' && (
            <MaterialIcons style={iconStyle} name={icon as MaterialIconNames} color={color} size={size} />
          )}
          {icon && iconsLibrary === 'FontAwesome6' && (
            <FontAwesome6 style={iconStyle} name={icon as FontAwesomeIconNames} color={color} size={size} />
          )}
          {text && <Text style={[styles.genericTextStyles, textStyle]}>{text}</Text>}
        </LinearGradientBackground>
      </Pressable>
    </>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    pressed: {
      opacity: 0.7,
    },
    genericTextStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.defaultText,
    },
  });
}

export default IconButton;
