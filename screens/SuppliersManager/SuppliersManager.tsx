import React from 'react';
// import AddColor from '../../components/colors/AddColor'
// import EditColors from '../../components/colors/EditColors'
import { Animated, StyleSheet } from 'react-native';
import SafeView from '../../components/layout/SafeView';
import AddSupplier from '../../components/suppliers/AddSupplier';
import EditSuppliers from '../../components/suppliers/EditSuppliers';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function SuppliersManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <SafeView>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddSupplier />
        <EditSuppliers />
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

export default SuppliersManager;
