import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '../../../../../../constants/colors'

function SelectedItem({ item, setSelectedItems, index }: any) {
  function onPressHandler() {
    setSelectedItems((prev:any) => prev.filter((_:any, i:number) => i !== index));
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

export default SelectedItem