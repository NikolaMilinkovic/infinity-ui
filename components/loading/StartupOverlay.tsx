import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

interface StartupOverlayTypes {
  message?: string;
  onFinish?: () => void; // callback when splash should hide
  duration?: number; // how long to show before fading out
}

function StartupOverlay({ message, onFinish, duration = 1500 }: StartupOverlayTypes) {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(onFinish, duration);
      return () => clearTimeout(timer);
    }
  }, [onFinish, duration]);

  return (
    <Animated.View style={styles.rootContainer} exiting={FadeOut.duration(800)}>
      <Image source={require('../../assets/infinity.png')} style={styles.image} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <ActivityIndicator size="large" />
    </Animated.View>
  );
}

export default StartupOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  image: {
    maxHeight: 140,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
    marginBottom: 24,
  },
});
