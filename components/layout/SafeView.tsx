import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeView({ children, style }: any) {
  const insets = useSafeAreaInsets();

  return <View style={[styles.container, { paddingBottom: insets.bottom }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
