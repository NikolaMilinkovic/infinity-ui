import React, { useEffect } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../constants/colors';


interface ColorTypes{
  _id: string
  color: string
  colorCode: string
  stock: number
}
interface PropTypes{
  colorsData: ColorTypes[],
  setColorsData: (data:ColorTypes[]) => void
}

function ColorStockInputs({ colorsData, setColorsData, }: PropTypes) {
  
  // Method for handling input changes
  function handleInputChange(color:string, value: string){
    const newStock = parseInt(value, 10) || 0;
    const updatedColorStock = colorsData.map((item) => {
      if(item.color === color){
        return { ...item, stock: newStock }
      }
      return item;
    })

    setColorsData(updatedColorStock);
  }

  // If no colors present
  if(colorsData.length < 1){
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizesContainer}>
        <Text style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>Boja</Text>
        <Text style={styles.header}>Količina</Text>
      </View>
      {colorsData.map((item, index) => (
        <KeyboardAvoidingView 
          style={[styles.rowContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2 ]} 
          key={`${index}-${item.color}`}
        >
          <Text style={styles.colorLabel}>{item.color}</Text>
          <TextInput
            key={`${item._id}-${item.color}`}
            placeholder="0"
            keyboardType="numeric"
            style={styles.input}
            value={String(item.stock)}
            onChangeText={(value) => handleInputChange(item.color, value)}
          />
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
    borderRadius: 4,
    borderColor: Colors.primaryDark,
    borderWidth: 0.5,
    marginTop: 10,
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

export default ColorStockInputs