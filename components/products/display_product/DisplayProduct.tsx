import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Colors } from '../../../constants/colors'
import ExpandButton from '../../../util-components/ExpandButton';
import DisplayDressStock from '../unique_product_components/display_stock/DisplayDressStock';
import DisplayPurseStock from '../unique_product_components/display_stock/DisplayPurseStock';
import { DressTypes, PurseTypes } from '../../../types/allTsTypes';
import { popupMessage } from '../../../util-components/PopupMessage';
import { NewOrderContext } from '../../../store/new-order-context';
import { MaterialIcons } from '@expo/vector-icons';
import IconButton from '../../../util-components/IconButton';

type ProductType = DressTypes | PurseTypes;
interface DisplayProductProps {
  item: ProductType;
}

function DisplayProduct({ item }: DisplayProductProps) {
  const [onStock, setOnStock] = useState(false);
  const styles = getStyles(onStock);
  const newOrderCtx = useContext(NewOrderContext);

  useEffect(() => {
    if(!item) return;
    let stockAvailable = false;

    if(item.category === 'Haljina'){
      const dressItem = item as DressTypes
      stockAvailable = dressItem.colors.some((colorObj) => 
        colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
      )
    }
    if(item.category === 'Torbica'){
      const purseItem = item as PurseTypes
      stockAvailable = purseItem.colors.some((colorObj) =>
        colorObj.stock > 0
      )
    }
    setOnStock(stockAvailable);
  },[item])

  // =============================================================================
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // TEMP
  function handleOnPress(){
    if(onStock){
      newOrderCtx.addProductReference(item);
      if(item.category === 'Haljina'){
        console.log('> Adding haljinu')
        const productObj = {
          itemReference: item,
          selectedColor: '',
          selectedSize: '',
          isReservation : false,
          selectedCourier: '',
        }
        newOrderCtx.addProduct(productObj);
      }
      if(item.category === 'Torbica'){
        console.log('> Adding torbicu')
        const productObj = {
          itemReference: item,
          selectedColor: '',
        }
        newOrderCtx.addProduct(productObj);
      }
      
      popupMessage(`${item.name} dodat u porudžbinu.\nTrenuthin artikala u porudžbini: ${newOrderCtx.productData.length + 1}`, 'success');
    } else {
      popupMessage(`${item.name} je rasprodati i nije dodat u porudžbinu!`,'danger')
    }
  }

  return (
    <View 
      key={item._id} 
      style={styles.container} 
    >

      {/* IMAGE AND INFORMATIONS */}
      <View style={styles.infoContainer}>

        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image.uri }} style={styles.image} />
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

        {onStock && (
          <IconButton
            size={26}
            color={Colors.secondaryDark}
            onPress={handleOnPress}
            key={`key-${item._id}`}
            icon='add'
            style={styles.addButtonContainer} 
            pressedStyles={styles.addButtonContainerPressed}
          />
        )}
      </View>

      {/* STOCK DATA */}
      <View style={styles.stockDataContainer}>

        {/* DISPLAY DRESSES STOCK */}
        {item && item.category === 'Haljina' && (
          <DisplayDressStock
            isExpanded={isExpanded}
            item={item as DressTypes}
          />
        )}

        {/* DISPLAY PURSES STOCK */}
        {item && item.category === 'Torbica' && (
          <DisplayPurseStock
            isExpanded={isExpanded}
            item={item as PurseTypes}
          />
        )}
      </View>
    </View>
  )
}

function getStyles(onStock:boolean){
  return StyleSheet.create({
    container: {
      minHeight: 160,
      padding: 6,
      paddingVertical: 10,
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
    imageContainer: {
      position: 'relative', 
      height: 140, 
      borderRadius: 8,
      overflow: 'hidden'
    },
    image: {
      flex: 4,
      width: 120,
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
      paddingHorizontal: 6
    },
    onStockText: {
      color: Colors.success,
      fontWeight: 'bold',
    },
    addButtonContainer: {
      position: 'absolute',
      right: 8,
      top: 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: Colors.white,
      padding: 10,
      elevation: 2
    },
    addButtonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    }
  })
}

export default DisplayProduct