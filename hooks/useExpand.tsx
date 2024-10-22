import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

export const useExpandAnimation = (isExpanded: boolean, minHeight: number = 50, maxHeight: number = 100, duration: number = 180) => {
  // Use `useMemo` to ensure `Animated.Value` is created once and doesn't reinitialize on each render
  const toggleExpandAnimation = useMemo(() => new Animated.Value(maxHeight), [maxHeight]);

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

export const useExpandAnimationWithContentVisibility = (isExpanded:boolean, setIsContentVisible: (isVisible:boolean) => void, minHeight:number = 50, maxHeight:number = 100, duration = 180) => {
  // Use `useMemo` to ensure `Animated.Value` is created once and doesn't reinitialize on each render
  const toggleExpandAnimation = useMemo(() => new Animated.Value(maxHeight), [maxHeight]);

  useEffect(() => {
    if(isExpanded) setIsContentVisible(true);
    const animation = Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? maxHeight : minHeight,
      duration: duration,
      useNativeDriver: false,
    })
    animation.start(() => {
      if(!isExpanded) {
        setIsContentVisible(false);
      }
    });
    
    // Clean up the animation if the component unmounts
    return () => animation.stop();
  }, [isExpanded, maxHeight, minHeight, duration, setIsContentVisible]);

  return toggleExpandAnimation
}