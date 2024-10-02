import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Text, View, FlatList, StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { ColorsContext } from '../store/colors-context';

function AddItem() {
  // Fade in animation
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();
  const colorsCtx = useContext(ColorsContext);
  const [colors, setColors] = useState<any[]>([]);
  useEffect(() => {
    const ctxColors = colorsCtx.getColors();
    console.log("Colors from context:", ctxColors);
    setColors(ctxColors);
  }, [colorsCtx])

  useEffect(() => {
    console.log(colors)
  }, [colors])

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
      {colors && colors.length > 0 && (
        colors.map((color) => (
          <Text key={color._id} style={styles.tempText}>{color.color}</Text>
        ))
      )}
      {/* <Text>ADD ITEM PAGE 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quidem minus illum dolores placeat. Sequi accusamus obcaecati, ullam consequatur aliquid quae ad vitae voluptatum fugit tenetur! Reprehenderit vitae consectetur aspernatur!  
      </Text> */}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  tempText:{
    fontSize: 34
  }
});

export default AddItem