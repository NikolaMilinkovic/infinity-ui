import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

export const useExpandAnimation = (
  isExpanded: boolean,
  minHeight: number = 50,
  maxHeight: number = 100,
  duration: number = 180
) => {
  // Use `useMemo` to ensure `Animated.Value` is created once and doesn't reinitialize on each render
  const toggleExpandAnimation = useMemo(() => new Animated.Value(minHeight), [minHeight]);

  useEffect(() => {
    const animation = Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? maxHeight : minHeight,
      duration: duration,
      useNativeDriver: false,
    });
    animation.start();

    // Clean up the animation if the component unmounts
    return () => animation.stop();
  }, [isExpanded, maxHeight, minHeight, duration]);

  return toggleExpandAnimation;
};

import { useRef } from 'react';

export const useExpandAnimationFromExpandedState = (
  isExpanded: boolean,
  minHeight: number = 50,
  maxHeight: number = 100,
  duration: number = 180
) => {
  // Create once
  const animatedValue = useRef(new Animated.Value(isExpanded ? maxHeight : minHeight)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isExpanded ? maxHeight : minHeight,
      duration,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, minHeight, maxHeight, duration]);

  return animatedValue;
};

export const useExpandAnimationWithContentVisibility = (
  isExpanded: boolean,
  setIsContentVisible: (isVisible: boolean) => void,
  minHeight: number = 50,
  maxHeight: number = 100,
  duration = 180
) => {
  // Use `useMemo` to ensure `Animated.Value` is created once and doesn't reinitialize on each render
  const toggleExpandAnimation = useMemo(() => new Animated.Value(minHeight), [minHeight]);

  useEffect(() => {
    if (isExpanded) setIsContentVisible(true);
    const animation = Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? maxHeight : minHeight,
      duration: duration,
      useNativeDriver: false,
    });
    animation.start(() => {
      if (!isExpanded) {
        setIsContentVisible(false);
      }
    });

    // Clean up the animation if the component unmounts
    return () => animation.stop();
  }, [isExpanded, maxHeight, minHeight, duration, setIsContentVisible]);

  return toggleExpandAnimation;
};

export const useExpandAnimationWithContentVisibilityFromExpandedState = (
  isExpanded: boolean,
  setIsContentVisible: (isVisible: boolean) => void,
  minHeight: number = 50,
  maxHeight: number = 100,
  duration = 180
) => {
  // Use `useMemo` to ensure `Animated.Value` is created once and doesn't reinitialize on each render
  const toggleExpandAnimation = useMemo(() => new Animated.Value(maxHeight), [maxHeight]);

  useEffect(() => {
    if (isExpanded) setIsContentVisible(true);
    const animation = Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? maxHeight : minHeight,
      duration: duration,
      useNativeDriver: false,
    });
    animation.start(() => {
      if (!isExpanded) {
        setIsContentVisible(false);
      }
    });

    // Clean up the animation if the component unmounts
    return () => animation.stop();
  }, [isExpanded, maxHeight, minHeight, duration, setIsContentVisible]);

  return toggleExpandAnimation;
};
