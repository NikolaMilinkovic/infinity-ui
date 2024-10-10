import React from 'react'
import AddColor from '../../components/colors/AddColor'
import EditColors from '../../components/colors/EditColors'
import { StyleSheet, Animated } from 'react-native';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function ColorsManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <AddColor />
      <EditColors/>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tempText:{
    fontSize: 34
  }
});

export default ColorsManager