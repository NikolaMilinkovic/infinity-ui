import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import AddCourier from '../../components/couriers/AddCourier';
import EditCourier from '../../components/couriers/EditCourier';
import SafeView from '../../components/layout/SafeView';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function CouriersManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <SafeView>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddCourier />
        <EditCourier />
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

export default CouriersManager;
