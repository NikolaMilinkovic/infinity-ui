// components/KeyboardAvoidingWrapper.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, View, ViewStyle } from 'react-native';
import { useThemeColors } from '../store/theme-context';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
}

const KeyboardAvoidingWrapper: React.FC<Props> = ({ children }) => {
  const colors = useThemeColors();
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      contentContainerStyle={{ backgroundColor: colors.primaryDark }}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );
};

export default KeyboardAvoidingWrapper;
