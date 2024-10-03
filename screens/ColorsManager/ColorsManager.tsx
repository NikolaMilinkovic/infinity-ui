import React from 'react'
import Animated from 'react-native-reanimated'
import AddColor from '../../components/colors/AddColor'
import EditColors from '../../components/colors/EditColors'
import { StyleSheet, Text } from 'react-native';

function ColorsManager() {

  return (
    <Animated.View style={[styles.container]}>
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