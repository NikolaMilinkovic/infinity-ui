import React from 'react'
import Animated from 'react-native-reanimated'
// import AddCategory from '../../components/categories/AddCategory'
// import EditCategories from '../../components/categories/EditCategories'
import { StyleSheet } from 'react-native';

function CategoriesManager() {

  return (
    <Animated.View style={[styles.container]}>
      {/* <AddCategory /> */}
      {/* <EditCategories/> */}
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