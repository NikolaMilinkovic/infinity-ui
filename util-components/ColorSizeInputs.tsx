import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../constants/colors';
import { DressColorTypes } from '../types/allTsTypes';
import { betterConsoleLog } from '../util-methods/LogMethods';

interface PropTypes{
  colorsData: DressColorTypes[],
  setColorsData: (data:DressColorTypes[]) => void
}

function ColorSizeInputs({
  colorsData,
  setColorsData,
}: PropTypes) {

  // Ensure all sizes have a stock value initialized to 0 if undefined
  const initializedColorsData = colorsData.map(item => ({
    ...item,
    sizes: item.sizes.map(sizeItem => ({
      ...sizeItem,
      stock: sizeItem.stock ?? 0,
    })),
  }));

  // Method for handling input changes
  function handleInputChange(color: string, size: string, value: string){
    betterConsoleLog(`> Changing value for color: ${color}, size: ${size}, value: ${value}`, '')
    const newStock = parseInt(value, 10) || 0;
    const updatedColors = initializedColorsData.map((item) => {
      if (item.color === color) {
        const updatedSizes = item.sizes.map((s) => 
          s.size === size ? { ...s, stock: newStock } : s
        );
        return { ...item, sizes: updatedSizes };
      }
      return item;
    });

    setColorsData(updatedColors);
  }

  // If no colors present
  if (colorsData.length < 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizesContainer}>
        <Text style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>Boja</Text>
        <Text style={styles.header}>UNI</Text>
        <Text style={styles.header}>XS</Text>
        <Text style={styles.header}>S</Text>
        <Text style={styles.header}>M</Text>
        <Text style={styles.header}>L</Text>
        <Text style={styles.header}>XL</Text>
      </View>
      {initializedColorsData.map((item, index) => (
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
              selectTextOnFocus
            />
          ))}
        </KeyboardAvoidingView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 4,
    borderRadius: 4,
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