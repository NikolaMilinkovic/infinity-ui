import React from 'react'
import { StyleSheet, Animated } from 'react-native';
import AddCategories from '../../components/categories/AddCategories';
import EditCategories from '../../components/categories/EditCategories';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function CategoriesManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <AddCategories/>
      <EditCategories/>
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

export default CategoriesManager