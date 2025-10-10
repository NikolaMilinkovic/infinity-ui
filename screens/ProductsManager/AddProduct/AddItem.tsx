import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import SafeView from '../../../components/layout/SafeView';
import AddProduct from '../../../components/products/AddProduct';
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';

function AddItem() {
  // ANIMATIONS
  const fadeAnimation = useFadeAnimation();

  return (
    <SafeView>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddProduct />
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

export default AddItem;
