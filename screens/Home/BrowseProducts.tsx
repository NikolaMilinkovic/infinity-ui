import React from 'react'
import { Animated, Text, View } from 'react-native'
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function BrowseProducts() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  
  return (
    <Animated.View style={{ opacity: fadeAnimation }}>
      <Text>
        BROWSE PAGE
      </Text>
    </Animated.View>
  )
}

export default BrowseProducts