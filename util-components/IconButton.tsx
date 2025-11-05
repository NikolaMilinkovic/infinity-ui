import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import LinearGradientBackground from '../components/gradients/LinearBackgroundGradient';
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
}: IconButtonProps) {
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
          {text && <Text style={textStyle}>{text}</Text>}
        </LinearGradientBackground>
      </Pressable>
    </>
  );
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
