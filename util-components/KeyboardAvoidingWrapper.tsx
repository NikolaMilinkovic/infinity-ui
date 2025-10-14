// components/KeyboardAvoidingWrapper.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
}

const KeyboardAvoidingWrapper: React.FC<Props> = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
