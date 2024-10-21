import React, { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFadeAnimation, useToggleFadeAnimation } from '../../../../hooks/useFadeAnimation';
import { Colors } from '../../../../constants/colors';
import { DressTypes } from '../../../../types/allTsTypes';

interface PropTypes {
  isExpanded: boolean
  item: DressTypes
}
function DisplayDressStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const styles = getStyles(isExpanded);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  
  // Extracts all the colors that have at least one size withing its stock
  useEffect(() => {
    if(!item) return;
    if (item.stockType === 'Boja-Veličina-Količina') {
      // Filter colors that have at least one size with stock
      const colorsWithStock = item.colors
        .filter((colorObj) => colorObj.sizes.some((sizeObj) => sizeObj.stock > 0))
        .map((colorObj) => colorObj.color);
      setAvailableColors(colorsWithStock);
    }
  }, [item])


  if(!item) return;
  return (
    <>
      {isExpanded && item.stockType === 'Boja-Veličina-Količina' && (
        <Animated.View style={[styles.container, { overflow: 'hidden', opacity: toggleFade}]}>
            <View style={styles.sizesContainer}>
              <Text style={{ width: 100, fontWeight: 'bold', textAlign: 'center' }}>Boja</Text>
              <Text style={styles.header}>UNI</Text>
              <Text style={styles.header}>XS</Text>
              <Text style={styles.header}>S</Text>
              <Text style={styles.header}>M</Text>
              <Text style={styles.header}>L</Text>
              <Text style={styles.header}>XL</Text>
            </View>
            {item.colors.map((colorItem, index) => {
              // Sort sizes so "UNI" comes first
              const sortedSizes = [...colorItem.sizes].sort((a, b) => {
                if (a.size === "UNI") return -1;
                if (b.size === "UNI") return 1;
                return 0;
              });

              return (
                <View 
                  style={[
                    styles.rowContainer, 
                    index % 2 === 0 ? (availableColors.length > 0 ? styles.rowColorOnStock : styles.rowColorOutOfStock) : styles.rowColor2
                  ]}
                  key={`${index}-${colorItem.color}`}
                >
                  <Text style={styles.colorLabel2}>{colorItem.color}</Text>

                  {sortedSizes.map((size, index) => (
                    <Text key={`${colorItem.color}${index}`} style={styles.sizeText}>{size.stock}</Text>
                  ))}
                  
                  {/* {sortedSizes.map((size, index) => (
                    <Pressable
                      onPress={() => console.log(`> You selected ${size.size}`)}
                      key={`${colorItem.color}${index}`} 
                      style={styles.pressable} 
                    >
                      <Text style={styles.sizeText}>{size.stock}</Text>
                    </Pressable>
                  ))} */}
                </View>
              );
            })}
          </Animated.View>
        )}
    </>
  )
}

function getStyles(isExpanded:boolean){
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
      padding: 4,
      borderRadius: 4,
      borderColor: Colors.primaryDark,
      borderWidth: 0.5,
      marginBottom: 10,
      marginTop: 10,
    },
    sizesContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 2,
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
      paddingVertical: 4, 
      paddingHorizontal: 2,
    },
    rowColorOnStock: {
      backgroundColor: Colors.successSecondary
    },
    rowColor2: {
    },
    rowColorOutOfStock: {
      backgroundColor: Colors.secondaryHighlight
    },
    colorLabel2: {
      width: 100,
      textAlign: 'center',
    },
    sizeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryDark,
      textAlign: 'center',
      padding: 8,
      paddingHorizontal: 4,
      marginHorizontal: 4,
      flex: 1,
    },
    pressable: {
      padding: 6,
      borderWidth: 0.5,
      borderColor: Colors.success,
    }
  })
}

export default DisplayDressStock