import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import AddProduct from '../../components/products/AddProduct';

function AddItem() {

  // ANIMATIONS
  const fadeAnimation = useFadeAnimation();
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <AddProduct/>
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

export default AddItem