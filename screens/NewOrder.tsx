import React, { useEffect, useRef, useState } from 'react'
import { Animated, Text, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, fadeAnimation]);
  
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