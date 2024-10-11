import React from 'react'
import { Animated, Text } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  
  return (
    <Animated.View style={{ opacity: fadeAnimation }}>
      <Text>
        NEW ORDER PAGE
      </Text>
    </Animated.View>
  )
}

export default NewOrder