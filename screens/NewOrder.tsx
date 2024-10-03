import React, { useEffect, useRef, useState } from 'react'
import { Animated, Text, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { useFadeAnimation } from '../hooks/useFadeAnimation';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  
  return (
    <Animated.View style={{ opacity: fadeAnimation }}>
      <Text>NEW ORDER PAGE
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!  
      </Text>
    </Animated.View>
  )
}

export default NewOrder