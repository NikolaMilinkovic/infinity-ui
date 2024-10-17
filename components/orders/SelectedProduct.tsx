import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { ProductTypes } from '../../types/allTsTypes'
import { Colors } from '../../constants/colors'
import { NewOrderContextTypes } from '../../types/allTsTypes'

interface PropTypes{
  item: ProductTypes
  orderCtx: NewOrderContextTypes
  index: number
}
function SelectedProduct({ item, orderCtx, index }: PropTypes) {
  
  function onPressHandler(){
    orderCtx.removeProduct(index)
  }
  return (
    <Pressable 
      onPress={onPressHandler}
      style={({pressed}) => [styles.pressable, pressed && styles.pressed]}
      key={`${index}-${item._id}`}
    >
      <Text style={styles.text}>[{index + 1}]  {item.name}</Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    padding: 10,
    backgroundColor: Colors.secondaryLight,
    elevation: 2,
    borderRadius: 4,
    marginBottom: 6
  },
  pressed: {
    opacity: 0.7,
    elevation: 1,
  },
  text: {
    color: Colors.primaryDark,
    fontSize: 16,
  }
})

export default SelectedProduct