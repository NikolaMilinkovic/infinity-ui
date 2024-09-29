import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View , Text, TextInput, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputFieldProps {
  label?: string | null | undefined,
  isSecure?: boolean,
  inputText: string,
  setInputText: (text: string) => void,
}

function InputField({ label, isSecure=false, inputText, setInputText } :InputFieldProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const styles = getStyles(isActive, inputText);

  // Fade in / out animation
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: inputText !== '' ? -16 : isActive ? -16 : 8,
      duration: inputText !== '' ? 0 : 150,
      useNativeDriver: true
    }).start();
  }, [isActive, inputText]);

  return (
    <View style={styles.container}>
      {label && (
        <Animated.View style={[styles.labelContainer, { transform: [{ translateY }] }]}>
          <Animated.Text style={styles.label}>
            {label}
          </Animated.Text>
        </Animated.View>
      )}
      <TextInput 
        style={styles.input}
        value={inputText}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onChangeText={text => setInputText(text)}
        autoCapitalize='none'
        autoComplete='off'
        secureTextEntry={isSecure && !showPassword}
        keyboardType='default'
      />
      {isSecure && isSecure === true && (
        <Pressable onPress={() => setShowPassword(!showPassword)} style={({ pressed }) => [styles.showHideText, pressed && styles.pressed]}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#333" />
        </Pressable>
      )}
    </View>
  )
}

function getStyles(isActive: boolean, inputText: string){
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
      paddingVertical: 8
    },
    labelContainer: {
      position: 'absolute',
      left: 18,
      top: 12,
      backgroundColor: isActive ? 'white' : inputText !== '' ? 'white' : 'transparent',
      zIndex: isActive ? 1 : inputText !== '' ? 1 : 0,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    label: {
      fontSize: 16,
      color: isActive ? 'blue' : '#333333',
    },
    input: {
      padding: 8,
      fontSize: 16,
      borderColor: isActive ? 'blue' : '#333333',
      borderWidth: 1,
      borderRadius: 4,
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