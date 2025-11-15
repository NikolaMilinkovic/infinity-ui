import { memo, useRef, useState } from 'react';
import { Animated, StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useGlobalStyles } from '../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../store/theme-context';

interface MultilineInputProps {
  value: string;
  setValue: (text: string) => void;
  placeholder?: string;
  background?: string;
  color?: string;
  activeColor?: string;
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  numberOfLines?: number;
  keyboard?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  label?: string;
}

const MultilineInput = ({
  value,
  setValue,
  placeholder = '',
  background,
  color,
  activeColor,
  containerStyles,
  inputStyles,
  numberOfLines = 4,
  keyboard = 'default',
  label = '',
}: MultilineInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  const labelAnim = useRef(new Animated.Value(value !== '' ? 1 : 0)).current;

  const handleFocus = () => {
    setIsActive(true);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsActive(false);
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleInput = (text: string) => {
    setValue(text);
  };

  const labelStyles = {
    position: 'absolute' as const,
    left: 18,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: background ? background : colors.background,
    zIndex: 1,
    pointerEvents: 'none',
    transform: [
      {
        translateY: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, -12],
        }),
      },
    ],
  };

  const labelTextColor = isActive || value ? (activeColor ? activeColor : colors.borderColor) : colors.defaultText;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background ? background : colors.primaryLight,
          borderColor: isActive ? (activeColor ? activeColor : colors.borderColor) : colors.borderColor,
        },
        containerStyles,
      ]}
    >
      {label && !placeholder && (
        <Animated.View style={[labelStyles]}>
          <Text style={{ color: labelTextColor }}>{label}</Text>
        </Animated.View>
      )}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          globalStyles.fontRegular,
          { color: color ? color : colors.defaultText, textAlignVertical: 'top' },
          inputStyles,
        ]}
        multiline
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={handleInput}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboard}
        placeholderTextColor={colors.defaultText}
        selectionColor={colors.borderColor}
      />
    </View>
  );
};

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      position: 'relative',
      paddingHorizontal: 0,
    },
    input: {
      fontSize: 14,
      padding: 8,
      paddingHorizontal: 22,
      borderRadius: 4,
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });
}

export default memo(MultilineInput);
