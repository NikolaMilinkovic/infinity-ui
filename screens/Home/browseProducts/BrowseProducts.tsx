import React from 'react'
import { Animated, Text } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import DisplayProducts from '../../../components/products/DisplayProducts';

function BrowseProducts() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  
  return (
    <Animated.View style={{ opacity: fadeAnimation }}>
      <DisplayProducts/>
    </Animated.View>
  )
}

export default BrowseProducts