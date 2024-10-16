import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Colors } from '../../../constants/colors'
import ExpandButton from '../../../util-components/ExpandButton';
import DisplayDressStock from '../unique_product_components/display_stock/DisplayDressStock';
import DisplayPurseStock from '../unique_product_components/display_stock/DisplayPurseStock';

interface ColorSizeType {
  size: string;
  stock: number;
  _id: string;
}
interface ImageType {
  uri: string;
  imageName: string;
}
interface DressColorType {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeType[];
}
interface DressType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: DressColorType[];
  image: ImageType;
}
interface PurseColorType {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;
}
interface PurseType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: PurseColorType[];
  image: ImageType;
}
type ProductType = DressType | PurseType;
interface DisplayProductProps {
  item: ProductType;
}

function DisplayProduct({ item }: DisplayProductProps) {
  const [onStock, setOnStock] = useState(false);
  const styles = getStyles(onStock);

  useEffect(() => {
    if(!item) return;
    let stockAvailable = false;

    if(item.category === 'Haljina'){
      const dressItem = item as DressType
      stockAvailable = dressItem.colors.some((colorObj) => 
        colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
      )
    }
    if(item.category === 'Torbica'){
      const purseItem = item as PurseType
      stockAvailable = purseItem.colors.some((colorObj) =>
        colorObj.stock > 0
      )
    }
    setOnStock(stockAvailable);
  },[item])

  // =============================================================================
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    console.log('> Toggle Expand called', isExpanded)
    setIsExpanded(!isExpanded);
  };

  return (
    <Pressable key={item._id} style={styles.container} onPress={() => {console.log('> Button for creating a new order clicked')}}>

      {/* IMAGE AND INFORMATIONS */}
      <View style={styles.infoContainer}>

        <View style={{position: 'relative', height: 140, width: 120}}>
          <Image resizeMode="contain" source={{ uri: item.image.uri }} style={styles.image} />
        </View>

        <View style={styles.info}>
          <Text style={styles.headerText}>{item.name}</Text>
          <Text>Kategorija: {item.category}</Text>
          <Text>Cena: {item.price} RSD</Text>


          {!onStock && (
          <Text style={styles.soldText}>RASPRODATO</Text>
          )}
          {onStock && (
            <Text style={styles.onStockText}>DOSTUPNO</Text>
          )}
            <ExpandButton
              isExpanded={isExpanded}
              handleToggleExpand={toggleExpand}
              containerStyles={styles.expandButton}
              iconStyles={styles.expandButtonIcon}
            />
        </View>
      </View>

      {/* STOCK DATA */}
      <View style={styles.stockDataContainer}>

        {/* DISPLAY DRESSES STOCK */}
        {item && item.category === 'Haljina' && (
          <DisplayDressStock
            isExpanded={isExpanded}
            item={item as DressType}
          />
        )}

        {/* DISPLAY PURSES STOCK */}
        {item && item.category === 'Torbica' && (
          <DisplayPurseStock
            isExpanded={isExpanded}
            item={item as PurseType}
          />
        )}
      </View>
    </Pressable>
  )
}

function getStyles(onStock:boolean){
  return StyleSheet.create({
    container: {
      minHeight: 160,
      padding: 10,
      width: '100%',
      borderBottomWidth: 0.5,
      borderColor: Colors.highlight,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      marginBottom: 4,
      elevation: 2,
      position: 'relative',
    },
    infoContainer: {
      width: '100%',
      flexDirection: 'row',
      height: 140,
      paddingRight: 16,
      paddingLeft: 6,
      position: 'relative'
    },
    info: {
      flex: 8,
      height: '100%',
      marginLeft: 16,
      position: 'relative',
    },
    image: {
      flex: 4
    },
    headerText: {
      fontSize: 16, 
      fontWeight: 'bold',
      color: Colors.primaryDark,
      maxHeight: 40,
    },
    soldText: {
      color: Colors.error,
      fontWeight: 'bold',
    },
    expandButton: {
      position: 'absolute',
      marginTop: 'auto',
      top: 'auto',
      height: 40,
      bottom: -10,
      right: 0,
      marginLeft: 'auto',
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      borderColor: onStock ? Colors.success : Colors.error,
      borderWidth: 0,
      width: '100%',
    },
    expandButtonIcon: {
      color: onStock ? Colors.success : Colors.error,
    },
    stockDataContainer:{
      width: '100%',
      paddingHorizontal: 18
    },
    onStockText: {
      color: Colors.success,
      fontWeight: 'bold',
    },
  })
}

export default DisplayProduct