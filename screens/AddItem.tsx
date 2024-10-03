import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Text, View, FlatList, StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { ColorsContext } from '../store/colors-context';
import AddColor from '../components/colors/AddColor';
import EditColors from '../components/colors/EditColors';
import { useFadeAnimation } from '../hooks/useFadeAnimation';

function AddItem() {

  // ANIMATIONS
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

export default AddItem