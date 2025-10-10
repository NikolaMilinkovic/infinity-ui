import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const useFadeTransition = (isVisible: boolean, duration = 500) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration });
  }, [isVisible, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return animatedStyle;
};

// export const useFadeTransitionReversed = (isVisible: boolean, duration = 500, delay = 500) => {
//   const opacity = useSharedValue(1);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       opacity.value = withTiming(isVisible ? 0 : 1, { duration });
//     }, delay);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [isVisible, duration]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: opacity.value,
//     };
//   });

//   return animatedStyle;
// };

import { withDelay } from 'react-native-reanimated';

export const useFadeTransitionReversed = (isVisible: boolean, duration = 500, delay = 500) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    const animation = withDelay(delay, withTiming(isVisible ? 0 : 1, { duration }));
    opacity.value = animation;

    return () => {
      opacity.value = 1; // Reset opacity on cleanup
    };
  }, [isVisible, duration, delay]);

  return {
    opacity: opacity.value,
  };
};
