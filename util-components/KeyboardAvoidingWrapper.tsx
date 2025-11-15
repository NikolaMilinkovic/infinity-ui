// components/KeyboardAvoidingWrapper.tsx
import React from 'react';
import { ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../store/theme-context';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  keyboardVerticalOffset?: number;
  scroll?: boolean;
}

const KeyboardAvoidingWrapper: React.FC<Props> = ({ children, style, scroll = true }) => {
  const colors = useThemeColors();
  return (
    <>
      <AnimatedKeyboardAwareScrollView
        bottomOffset={70}
        style={[{ flex: 1, backgroundColor: colors.background }, style]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scroll}
      >
        {children}
      </AnimatedKeyboardAwareScrollView>
    </>
  );
};

export default KeyboardAvoidingWrapper;
