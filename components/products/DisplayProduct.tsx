import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
function DisplayProduct({ item }) {
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [onStock, setOnStock] = useState(false);
  const styles = getStyles(onStock);
  useEffect(() => {
    let stockAvailable = false;
    if(item.category === 'Haljina'){
      stockAvailable = item.colors.some((colorObj) => 
        colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
      )
    }
    if(item.category === 'Torbica'){
      stockAvailable = item.colors.some((colorObj) =>
        colorObj.stock > 0
      )
    }
    setOnStock(stockAvailable);

    if (item.category === 'Haljina') {
      // Filter sizes with stock greater than 0
      const sizesWithStock = item.colors.flatMap((colorObj) =>
        colorObj.sizes.filter((sizeObj) => sizeObj.stock > 0)
      );
      setAvailableSizes(sizesWithStock);
      
      // Filter colors that have at least one size with stock
      const colorsWithStock = item.colors
        .filter((colorObj) => colorObj.sizes.some((sizeObj) => sizeObj.stock > 0))
        .map((colorObj) => colorObj.color); // Get only the color names
      setAvailableColors(colorsWithStock);
    }
  
    if (item.category === 'Torbica') {
      // Filter colors with stock greater than 0
      const colorsWithStock = item.colors
        .filter((colorObj) => colorObj.stock > 0)
        .map((colorObj) => colorObj.color); // Get only the color names
      setAvailableColors(colorsWithStock);
    }
  },[item])

  return (
    <View key={item._id} style={styles.container}>
      <Image resizeMode="contain" source={{ uri: item.image.uri }} style={styles.image} />
      <View style={styles.infoContainer}>

        <Text style={styles.headerText}>{item.name}</Text>
        <Text>Kategorija: {item.category}</Text>
        <Text>Cena: {item.price} RSD</Text>
        {/* <Text>Status: {item.active ? "Active" : "Inactive"}</Text> */}
        {!onStock && (
          <Text style={styles.soldText}>RASPRODATO</Text>
        )}
        {onStock && (
          <Text style={styles.onStockText}>DOSTUPNO</Text>
        )}

        <View>
          {item.category === 'Haljina' && availableSizes.length > 0 && (
            <View>
              <Text>Dostupne Boje:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {availableColors.map((color, index) => (
                  <Text key={index} style={{ marginRight: 10 }}>{color},</Text>
                ))}
              </View>
            </View>
          )}

          {item.category === 'Torbica' && availableColors.length > 0 && (
            <View>
              <Text>Dostupne Boje:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {availableColors.map((color, index) => (
                  <Text key={index} style={{ marginRight: 10 }}>{color},</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

function getStyles(onStock:boolean){
  return StyleSheet.create({
    container: {
      height: 160,
      padding: 10,
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 0.5,
      borderColor: Colors.highlight,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: onStock ? Colors.successSecondary : Colors.secondaryHighlight,
      marginBottom: 4,
      elevation: 2,
      position: 'relative',
    },
    image: {
      height: '100%',
      flex: 4
    },
    infoContainer: {
      flex: 8,
      height: '100%',
      marginLeft: 8
    },
    headerText: {
      fontSize: 18, 
      fontWeight: 'bold',
      color: Colors.primaryDark,
    },
    soldText: {
      color: Colors.error,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 0,
      right: 10
    },
    onStockText: {
      color: Colors.success,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 0,
      right: 10
    }
  })
}

export default DisplayProduct