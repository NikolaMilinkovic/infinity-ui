import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native'
import { Colors } from '../../../constants/colors'
import ExpandButton from '../../../util-components/ExpandButton';
import DisplayDressStock from '../unique_product_components/display_stock/DisplayDressStock';
import DisplayPurseStock from '../unique_product_components/display_stock/DisplayPurseStock';
import { DressTypes, PurseTypes } from '../../../types/allTsTypes';
import { popupMessage } from '../../../util-components/PopupMessage';
import { NewOrderContext } from '../../../store/new-order-context';
import IconButton from '../../../util-components/IconButton';
import useCheckStockAvailability from '../../../hooks/useCheckStockAvailability';

type ProductType = DressTypes | PurseTypes;
interface HighlightedItemsProps {
  _id: string
  stockType: string
}
interface DisplayProductProps {
  item: ProductType;
  setEditItem: (data: ProductType | null) => void;
  highlightedItems: HighlightedItemsProps[];
  batchMode: boolean;
  onRemoveHighlight: (id: string) => void
  showImagePreview: (image: string) => void
}

function DisplayProduct({ item, setEditItem, highlightedItems, batchMode, onRemoveHighlight, showImagePreview }: DisplayProductProps) {
  const [onStock, setOnStock] = useState(false);
  const newOrderCtx = useContext(NewOrderContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const styles = getStyles(onStock, isHighlighted);
  if(item) useCheckStockAvailability(item, setOnStock);

  useEffect(() => {
    const highlighted = highlightedItems.some((highlightedItem) => item._id === highlightedItem._id);
    if(highlighted){
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlightedItems, item]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  // ADD item to new order
  function handleOnAddPress(){
    if(onStock){
      newOrderCtx.addProductReference(item);
      if(item.stockType === 'Boja-Veličina-Količina'){
        const productObj = {
          itemReference: item,
          name: item.name,
          category: item.category,
          price: item.price,
          stockType: item.stockType,
          image: {
            uri: item.image.uri,
            imageName: item.image.imageName
          },
          mongoDB_type: 'Dress',
          selectedColor: '',
          selectedColorId: '',
          selectedSize: '',
          selectedSizeId: '',
        }
        newOrderCtx.addProduct(productObj);
      }
      if(item.stockType === 'Boja-Količina'){
        const productObj = {
          itemReference: item,
          name: item.name,
          category: item.category,
          price: item.price,
          stockType: item.stockType,
          image: {
            uri: item.image.uri,
            imageName: item.image.imageName
          },
          mongoDB_type: 'Purse',
          selectedColor: '',
          selectedColorId: '',
        }
        newOrderCtx.addProduct(productObj);
      }
      
      popupMessage(`${item.name} dodat u porudžbinu.\nTrenuthin artikala u porudžbini: ${newOrderCtx.productData.length + 1}`, 'success');
    } else {
      popupMessage(`${item.name} je rasprodati i nije dodat u porudžbinu!`,'danger');
    }
  }
  // EDIT
  function handleOnEditPress(){
    setEditItem(item);
  }

  // async function handleOnShare() {
  //   const message = `Proizvod: ${item.name}, Cena: ${item.price}, Kategorija: ${item.category}`;
  //   await useShareMessage({ message: message, image: item.image });
  // }

  const [longPressActivated, setLongPressActivated] = useState(false);
  // function handleLongPress(orderId: string){
  //   if(batchMode) return;
  //   setLongPressActivated(true);
  //   setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
  //   if(selectedReservations.length === 0) setSelectedReservations([{_id: orderId}])
  //   setBatchMode(true);
  // }
  // Press handler after select mode is initialized
  // function handlePress(orderId: string){
  //   if(!batchMode) return;
  //   if (longPressActivated) return;
  //   if(selectedReservations.length === 0) return;
  //   const isIdSelected = selectedReservations?.some((presentItem) => presentItem._id === orderId)
  //   if(isIdSelected){
  //     if(selectedReservations.length === 1) setBatchMode(false);
  //     setSelectedReservations(selectedReservations.filter((order) => order._id !== orderId));
  //   } else {
  //     setSelectedReservations((prev) => [...prev, {_id: orderId}]);
  //   }
  // }

    // 0 = Not Highlighted, 1 = Highlighted
    const backgroundColor = useRef(new Animated.Value(0)).current; 
  
     // 1 = Highlighted, 0 = Default
    useEffect(() => {
      Animated.timing(backgroundColor, {
        toValue: isHighlighted ? 1 : 0,
        duration: 120,
        useNativeDriver: false,
      }).start();
    }, [isHighlighted]);
  
    const interpolatedBackgroundColor = backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.white, '#A3B9CC'], // White → Blue transition
    });

  return (
    <Animated.View
      key={item._id} 
      style={[styles.container, {backgroundColor: interpolatedBackgroundColor}]} 
      // onPress={toggleExpand}
      // delayLongPress={100}
    >
      {/* {isHighlighted && (
        <View style={styles.itemHighlightedOverlay}/>
      )} */}

      {/* IMAGE AND INFORMATIONS */}
      <View style={styles.infoContainer}>

        <Pressable style={styles.imageContainer} onPress={() => showImagePreview(item.image as any)}>
          <Image source={{ uri: item.image.uri }} style={styles.image} />
        </Pressable>

        <View style={styles.info}>
          <Text style={styles.headerText}>{item.name}</Text>



          {/* TEMP | REMOVE AFTER TESTING */}
          {/* <Text style={styles.headerText}>{item.displayPriority}</Text> */}



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

        {batchMode ? (
          <>
            {isHighlighted && (
              <IconButton
                size={26}
                color={Colors.secondaryDark}
                onPress={() => onRemoveHighlight(item._id)}
                key={`key-${item._id}-add-button`}
                icon='check'
                style={[styles.addButtonContainer, {backgroundColor: '#9FB7C6'}]} 
                pressedStyles={styles.buttonContainerPressed}
              />
            )}
          </>
        ) : (
          <>
            {onStock && (
              <IconButton
                size={26}
                color={Colors.secondaryDark}
                onPress={handleOnAddPress}
                key={`key-${item._id}-add-button`}
                icon='add'
                style={styles.addButtonContainer} 
                pressedStyles={styles.buttonContainerPressed}
              />
            )}
            <IconButton
              size={26}
              color={Colors.secondaryDark}
              onPress={handleOnEditPress}
              key={`key-${item._id}-edit-button`}
              icon='edit'
              style={styles.editButtonContainer} 
              pressedStyles={styles.buttonContainerPressed}
            />
          </>
        )}
      </View>

      {/* STOCK DATA */}
      <View style={styles.stockDataContainer}>

        {/* DISPLAY DRESSES STOCK */}
        {item && item.stockType === 'Boja-Veličina-Količina' && (
          <DisplayDressStock
            isExpanded={isExpanded}
            item={item as DressTypes}
          />
        )}

        {/* DISPLAY PURSES STOCK */}
        {item && item.stockType === 'Boja-Količina' && (
          <DisplayPurseStock
            isExpanded={isExpanded}
            item={item as PurseTypes}
          />
        )}
      </View>
      {item.supplier && isExpanded && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Dobavljač:  </Text>
          <Text style={styles.descriptionText}>{item.supplier}</Text>
        </View>
      )}
      {item.description && isExpanded && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Opis:  </Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
      )}
    </Animated.View>
  )
}

function getStyles(onStock:boolean, isHighlighted:boolean){
  return StyleSheet.create({
    descriptionContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    descriptionLabel: {
      fontWeight: 'bold',
      minWidth: 20,
    },
    descriptionText: {
      flex: 1,
    },
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
      backgroundColor: (onStock ? Colors.white : Colors.secondaryHighlight),
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
      maxWidth: '85%',
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
      backgroundColor: 'transparent',
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
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      padding: 10,
      elevation: 2
    },
    editButtonContainer : {
      position: 'absolute',
      right: 8,
      top: onStock ? 56 : 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      padding: 10,
      elevation: 2
    },
    buttonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    },
    itemHighlightedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.primaryDark,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none'
    }
  });
}

export default DisplayProduct