import { Ionicons } from '@expo/vector-icons';
import { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useGlobalStyles } from '../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import CustomText from './CustomText';

interface InputFieldProps {
  label?: string | null;
  isSecure?: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  capitalize?: 'sentences' | 'none' | 'words' | 'characters';
  background?: string;
  color?: string;
  activeColor?: string;
  keyboard?: KeyboardTypeOptions;
  labelBorders?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  labelStyles?: StyleProp<TextStyle>;
  selectTextOnFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  displayClearInputButton?: boolean;
  onManualInput?: () => void;
  placeholder?: string;
  selectionColor?: string;
}

const InputField = ({
  label,
  isSecure = false,
  inputText,
  setInputText,
  capitalize = 'sentences',
  background,
  color,
  activeColor,
  keyboard = 'default',
  labelBorders = true,
  containerStyles,
  selectTextOnFocus = false,
  multiline = false,
  numberOfLines = 1,
  labelStyles,
  placeholder = '',
  displayClearInputButton = false,
  fullBorder = true,
  selectionColor,
  onManualInput,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const colors = useThemeColors();
  const styles = getStyles(colors, fullBorder);
  const globalStyles = useGlobalStyles();

  // Label animation value
  const labelAnim = useRef(new Animated.Value(inputText !== '' ? 1 : 0)).current;

  // Animate only on focus/blur
  const handleFocus = () => {
    if (!isActive) setIsActive(true);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsActive(false);
    if (!inputText) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: inputText !== '' || isActive ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [inputText]);

  const handleInput = (text: string) => {
    setInputText(text.toString());
    if (onManualInput) onManualInput();
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: 18,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: background || colors.background,
    zIndex: 1,
    pointerEvents: 'none',
    transform: [
      {
        translateY: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -26],
        }),
      },
    ],
  };

  const labelTextColor = isActive || inputText ? activeColor : colors.defaultText;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background ? background : colors.background,
          borderColor: isActive ? (activeColor ? activeColor : colors.borderColor) : colors.secondaryLight,
        },
        containerStyles,
      ]}
    >
      {label && (
        <Animated.View style={[labelStyle as any, labelStyles]}>
          <CustomText style={[globalStyles.textRegular, { color: labelTextColor }]}>{label}</CustomText>
        </Animated.View>
      )}
      <TextInput
        ref={inputRef}
        style={[
          globalStyles.fontRegular,
          styles.input,
          {
            color: color ? color : colors.defaultText,
            borderColor: isActive ? activeColor : colors.borderColor,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        selectionColor={selectionColor || colors.borderColor}
        value={inputText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleInput}
        autoCapitalize={capitalize}
        autoComplete="off"
        secureTextEntry={isSecure && !showPassword}
        keyboardType={keyboard}
        selectTextOnFocus={selectTextOnFocus}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
      />
      {isSecure && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={({ pressed }) => [styles.showHideText, pressed && styles.pressed]}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.defaultText} />
        </Pressable>
      )}
      {displayClearInputButton && (
        <Pressable
          onPress={() => setInputText('')}
          style={({ pressed }) => [styles.showHideText, pressed && styles.pressed]}
        >
          <Ionicons name="close" size={24} color={colors.defaultText} />
        </Pressable>
      )}
    </View>
  );
};

function getStyles(colors: ThemeColors, fullBorder: boolean) {
  return StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 4,
      position: 'relative',
      justifyContent: 'center',
    },
    input: {
      minHeight: 44,
      padding: 8,
      fontSize: 14.5,
      borderRadius: 4,
      paddingHorizontal: 22,
      textAlignVertical: 'center',
      borderWidth: fullBorder ? 0.5 : 0,
      borderBottomWidth: 0.5,
    },
    showHideText: {
      position: 'absolute',
      right: 20,
      opacity: 0.7,
    },
    pressed: {
      opacity: 0.5,
    },
  });
}

// Memo to prevent unnecessary re-renders
export default memo(InputField);
