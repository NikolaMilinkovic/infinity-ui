import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export const useFadeAnimation = () => {
  const isFocused = useIsFocused();
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();

    return () => {
      fadeAnimation.setValue(isFocused ? 1 : 0)
    }
  }, [isFocused, fadeAnimation]);

  return fadeAnimation;
};