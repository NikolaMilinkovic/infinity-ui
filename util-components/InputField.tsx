import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View , TextInput, Animated, Pressable, TouchableWithoutFeedback, Keyboard, Modal, StyleProp, ViewStyle, TextStyle, KeyboardTypeOptions  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface InputFieldProps {
  label?: string | null;
  isSecure?: boolean;
  inputText: string | number | undefined;
  setInputText: (text: string | number | undefined) => void;
  capitalize?: 'sentences' | 'none' | 'words' | 'characters';
  background?: string;
  color?: string;
  activeColor?: string;
  keyboard?: KeyboardTypeOptions; // Use React Native's `KeyboardTypeOptions` for better type checking
  labelBorders?: boolean;
  containerStyles?: StyleProp<ViewStyle>; // For styling containers
  labelStyles?: StyleProp<TextStyle>; // For text-specific styles
  selectTextOnFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

function InputField({ 

  label, 
  isSecure=false, 
  inputText, 
  setInputText, 
  capitalize='sentences', 
  background=Colors.primaryLight, 
  color=Colors.primaryDark, 
  activeColor=Colors.secondaryDark,
  keyboard='default',
  labelBorders=true,
  containerStyles,
  selectTextOnFocus=false,
  multiline=false,
  numberOfLines=1,
  labelStyles,

} :InputFieldProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const styles = getStyles(isActive, inputText, background, color, activeColor, labelBorders, multiline);
  const inputRef = useRef(null);

  // Fade in / out animation
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: inputText !== '' ? -20 : isActive ? -20 : 4,
      duration: inputText !== '' ? 0 : 150,
      useNativeDriver: true
    }).start();
  }, [isActive, inputText, translateY]);

  return (
      <View style={[styles.container, containerStyles]}>
        {label && (
          <Animated.View style={[styles.labelContainer, { transform: [{ translateY },]}, labelStyles ]}>
            <Animated.Text style={[styles.label, labelStyles]}>
              {label}
            </Animated.Text>
          </Animated.View>

        )}
          <TextInput 
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onChangeText={text => setInputText(text)}
            autoCapitalize={capitalize}
            autoComplete='off'
            secureTextEntry={isSecure && !showPassword}
            keyboardType={keyboard}
            selectTextOnFocus={selectTextOnFocus}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        {isSecure && isSecure === true && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={({ pressed }) => [styles.showHideText, pressed && styles.pressed]}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#333" />
          </Pressable>
        )}
      </View>
  )
}

function getStyles(isActive: boolean, inputText: string, background:string, color:string, activeColor:string, labelBorders: string, multiline: boolean){
  const styles = StyleSheet.create({
    touchable: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    container: {
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
      backgroundColor: background,
    },
    labelContainer: {
      position: 'absolute',
      left: 18,
      top: 8,
      backgroundColor: isActive ? background : inputText !== '' ? background : 'transparent',
      borderColor: Colors.primaryDark,
      borderWidth: labelBorders ? (inputText !== '' ? 0.5 : 0) || (isActive ? 0.5 : 0) : 0,
      zIndex: isActive ? 1 : inputText !== '' ? 1 : 0,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    label: {
      fontSize: 16,
      color: isActive ? activeColor : color,
    },
    input: {
      padding: 8,
      fontSize: 16,
      borderColor: isActive ? activeColor : color,
      borderWidth: 0.5,
      borderRadius: 4,
      paddingHorizontal: 22,
      color: color,
      textAlignVertical: multiline ? 'top' : 'center' 
    },
    showHideText: {
      position: 'absolute',
      right: 20
    },
    pressed: {
      opacity: 0.7
    }
  })
  return styles
}


export default InputField