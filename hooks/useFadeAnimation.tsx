import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

// FADE ANIMATION ON FOCUS
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

// FADE ANIMATION ON TOGGLE
export const useToggleFadeAnimation = (isExpanded:boolean, duration:number = 180) => {
  const toggleFade = useRef(new Animated.Value(isExpanded ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(toggleFade, {
      toValue: isExpanded ? 1 : 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, duration]);

  return toggleFade;
}