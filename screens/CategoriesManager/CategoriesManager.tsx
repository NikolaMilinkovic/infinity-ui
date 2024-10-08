import React from 'react'
import Animated from 'react-native-reanimated'

import { StyleSheet } from 'react-native';
import AddCategories from '../../components/categories/AddCategories';
import EditCategories from '../../components/categories/EditCategories';

function CategoriesManager() {

  return (
    <Animated.View style={[styles.container]}>
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