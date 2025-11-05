import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useThemeColors } from '../store/theme-context';

interface UseHighlightAnimationTypes {
  isHighlighted: boolean;
  duration: number;
  highlightColor: string;
}
/**
 * Handles highlight animation
 * @returns backgroundColor value => backgroundColor: return value
 */
export const useHighlightAnimation = ({ isHighlighted, duration, highlightColor }: UseHighlightAnimationTypes) => {
  const colors = useThemeColors();
  // 0 = Not Highlighted, 1 = Highlighted
  const backgroundColor = useRef(new Animated.Value(0)).current;

  // 1 = Highlighted, 0 = Default
  useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: isHighlighted ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }, [isHighlighted]);

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, highlightColor], // White → Blue transition
  });
  return interpolatedBackgroundColor;
};
