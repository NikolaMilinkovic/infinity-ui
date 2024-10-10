import React from 'react'
import { Animated, Text } from 'react-native'
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import InputField from '../../util-components/InputField';
import BrowseProductsComponent from '../../components/products/BrowseProducts';

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