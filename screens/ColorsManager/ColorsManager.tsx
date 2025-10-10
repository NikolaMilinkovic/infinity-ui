import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import AddColor from '../../components/colors/AddColor';
import EditColors from '../../components/colors/EditColors';
import SafeView from '../../components/layout/SafeView';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function ColorsManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <SafeView>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddColor />
        <EditColors />
      </Animated.View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tempText: {
    fontSize: 34,
  },
});

export default ColorsManager;
