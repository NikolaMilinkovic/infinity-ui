import React from 'react'
import { StyleSheet, Animated } from 'react-native';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import AddCourier from '../../components/couriers/AddCourier';
import EditCourier from '../../components/couriers/EditCourier';

function CouriersManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <AddCourier/>
      <EditCourier/>
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

export default CouriersManager