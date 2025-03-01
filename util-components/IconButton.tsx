import React from 'react'
import { Pressable, Text, StyleSheet, Animated } from 'react-native'
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
type FontAwesomeIconNames = keyof typeof FontAwesome6.glyphMap;

interface IconButtonProps {
  icon?: MaterialIconNames | FontAwesomeIconNames;
  color?: string
  onPress: () => void
  size?: number
  text?: string
  style?: object 
  textStyle?: object
  iconStyle?: object
  pressedStyles?: object
  iconsLibrary?: 'MaterialIcons' | 'FontAwesome6';
}

// file-export
function IconButton({ icon, color, onPress, text, style, textStyle, iconStyle, size, pressedStyles, iconsLibrary = 'MaterialIcons' }: IconButtonProps) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [style, pressed && (pressedStyles || styles.pressed)]}>
      {icon && iconsLibrary === 'MaterialIcons' && (
        <MaterialIcons 
          style={iconStyle}
          name={icon as MaterialIconNames}
          color={color}
          size={size}
        />
      )}
      {icon && iconsLibrary === 'FontAwesome6' && (
        <FontAwesome6
          style={iconStyle}
          name={icon as FontAwesomeIconNames}
          color={color}
          size={size}
        />
      )}
      {text && (
        <Text style={textStyle}>{text}</Text>
      )}
    </Pressable>
  )
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default IconButton