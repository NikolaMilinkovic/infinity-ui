import React, { useEffect } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../constants/colors';


interface DressColorTypes{
  _id: string
  color: string
  colorCode: string
  sizes: { size: string; stock: number }[]
}
interface PropTypes{
  colorsData: DressColorTypes[],
  setColorsData: (data:DressColorTypes) => void
}


function ColorSizeInputs({
  colorsData,
  setColorsData,
}:PropTypes) {

  function handleInputChange(color:string, size: string, value: string){
    const newStock = parseInt(value, 10) || 0;
    const updatedColors = colorsData.map((item) => {
      if(item.color === color){
        const updatedSizes = item.sizes.map((s) => s.size === size ? {...s, stock: newStock} : s
        )
        return { ...item, sizes: updatedSizes }
      }
      return item;
    })

    setColorsData(updatedColors);
  }

  // useEffect(() => {
  //   console.log('===========================================================')
  //   colorsData.forEach(color => {
  //     color.sizes.forEach(size => {
  //       console.log(`> Size ${size.size} is currently at stock: `, size.stock);
  //     });
  //   });
  // }, [colorsData])

  // If no colors present
  if(colorsData.length < 1){
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizesContainer}>
        <Text style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>Color</Text>
        <Text style={styles.header}>XS</Text>
        <Text style={styles.header}>S</Text>
        <Text style={styles.header}>M</Text>
        <Text style={styles.header}>L</Text>
        <Text style={styles.header}>XL</Text>
        <Text style={styles.header}>UNI</Text>
      </View>
      {colorsData.map((item, index) => (
        <KeyboardAvoidingView 
          style={[styles.rowContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2 ]} 
          key={`${index}-${item.color}`}
        >
          <Text style={styles.colorLabel}>{item.color}</Text>

          {item.sizes.map((sizeObj) => (
            <TextInput
              key={`${item._id}-${sizeObj.size}`}
              placeholder="0"
              keyboardType="numeric"
              style={styles.input}
              value={String(sizeObj.stock)}
              onChangeText={(value) => handleInputChange(item.color, sizeObj.size, value)}
            />
          ))}
        </KeyboardAvoidingView>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 4,
    borderRadius: 8,
    borderColor: Colors.primaryDark,
    borderWidth: 0.5,
  },
  sizesContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, 
    paddingHorizontal: 2,
  },
  rowColor1: {
    backgroundColor: Colors.secondaryHighlight
  },
  rowColor2: {
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 4,
    marginHorizontal: 4,
    flex: 1,
    textAlign: 'center',
    backgroundColor: Colors.white
  },
  colorLabel: {
    width: 100,
    textAlign: 'center',
  },
});

export default ColorSizeInputs