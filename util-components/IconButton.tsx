import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

interface IconButtonProps {
  icon: string
  color: string
  onPress: () => void
  text?: string
  style?: object
  textStyle?: object
  iconStyle?: object
  size: number
}

function IconButton({ icon, color, onPress, text, style, textStyle, iconStyle, size }: IconButtonProps) {
  return (
    <Pressable onPress={onPress} style={(pressed) => [style, pressed && styles.pressed]}>
      <MaterialIcons 
        style={iconStyle}
        name={icon}
        color={color}
        size={size}
      />
      {text && (
        <Text style={textStyle}>{text}</Text>
      )}
    </Pressable>
  )
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7
  }
})

export default IconButton