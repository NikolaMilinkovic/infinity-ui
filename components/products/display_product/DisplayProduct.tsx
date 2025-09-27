import React, { useContext, useEffect, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import useCheckStockAvailability from '../../../hooks/useCheckStockAvailability';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useHighlightAnimation } from '../../../hooks/useHighlightAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import { useUser } from '../../../store/user-context';
import { DressTypes, ImageTypes, PurseTypes } from '../../../types/allTsTypes';
import IconButton from '../../../util-components/IconButton';
import { popupMessage } from '../../../util-components/PopupMessage';
import DisplayDressStock from '../unique_product_components/display_stock/DisplayDressStock';
import DisplayPurseStock from '../unique_product_components/display_stock/DisplayPurseStock';

type ProductType = DressTypes | PurseTypes;
interface HighlightedItemsProps {
  _id: string;
  stockType: string;
}
interface DisplayProductProps {
  item: ProductType;
  setEditItem: (data: ProductType | null) => void;
  highlightedItems: HighlightedItemsProps[];
  batchMode: boolean;
  onRemoveHighlight: (item: ProductType, stockType: string) => void;
  showImagePreview: (image: ImageTypes) => void;
  handleLongPress: any;
  handlePress: any;
  showAddBtn?: boolean;
}

function DisplayProduct({
  item,
  setEditItem,
  highlightedItems,
  batchMode,
  onRemoveHighlight,
  showImagePreview,
  handleLongPress,
  handlePress,
  showAddBtn = true,
}: DisplayProductProps) {
  const [onStock, setOnStock] = useState(false);
  const newOrderCtx = useContext(NewOrderContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const styles = getStyles(onStock, isHighlighted, showAddBtn);
  if (item) useCheckStockAvailability(item, setOnStock);
  const user = useUser();

  const expandedHeight = 600;
  const expandHeight = useExpandAnimation(isExpanded, 160, expandedHeight, 280);

  useEffect(() => {
    const highlighted = highlightedItems.some((highlightedItem) => item._id === highlightedItem._id);
    if (highlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlightedItems, item]);

  const toggleExpand = () => {
    handlePress(item);
    if (batchMode) return;
    setIsExpanded(!isExpanded);
  };

  /**
   * Adds a product to the order if it's in stock.
   * Handles different stock types and shows a confirmation or error message.
   * Tracks total stock for product and prevents from adding more items than available.
   */
  function handleOnAddPress() {
    // if (item.totalStock === 0) return popupMessage('Ovog proizvoda više nema na lageru!', 'danger');
    // item.totalStock--;

    if (!user?.permissions?.orders?.create) {
      return popupMessage('Nemate permisiju za kreiranje porudžbina', 'danger');
    }
    if (onStock) {
      newOrderCtx.addProductReference(item);
      if (item.stockType === 'Boja-Veličina-Količina') {
        const productObj = {
          itemReference: item,
          name: item.name,
          category: item.category,
          price: item.price,
          stockType: item.stockType,
          image: {
            uri: item.image.uri,
            imageName: item.image.imageName,
          },
          mongoDB_type: 'Dress',
          selectedColor: '',
          selectedColorId: '',
          selectedSize: '',
          selectedSizeId: '',
        };
        newOrderCtx.addProduct(productObj);
      }
      if (item.stockType === 'Boja-Količina') {
        const productObj = {
          itemReference: item,
          name: item.name,
          category: item.category,
          price: item.price,
          stockType: item.stockType,
          image: {
            uri: item.image.uri,
            imageName: item.image.imageName,
          },
          mongoDB_type: 'Purse',
          selectedColor: '',
          selectedColorId: '',
        };
        newOrderCtx.addProduct(productObj);
      }

      popupMessage(
        `${item.name} dodat u porudžbinu.\nTrenuthin artikala u porudžbini: ${newOrderCtx.productData.length + 1}`,
        'success'
      );
    } else {
      popupMessage(`${item.name} je rasprodati i nije dodat u porudžbinu!`, 'danger');
    }
  }
  // EDIT
  function handleOnEditPress() {
    setEditItem(item);
  }

  const backgroundColor = useHighlightAnimation({
    isHighlighted,
    duration: 120,
    highlightColor: '#A3B9CC',
  });

  return (
    <Pressable
      key={item._id}
      onPress={toggleExpand}
      delayLongPress={100}
      onLongPress={() => handleLongPress(item._id, item.stockType)}
    >
      <Animated.View
        style={[
          styles.container,
          { maxHeight: expandHeight, backgroundColor: onStock ? backgroundColor : Colors.secondaryHighlight },
        ]}
      >
        {/* IMAGE AND INFORMATIONS */}
        <View style={styles.infoContainer}>
          <Pressable style={styles.imageContainer} onPress={() => showImagePreview(item.image as any)}>
            <Image source={{ uri: item.image.uri }} style={styles.image} />
          </Pressable>

          <View style={styles.info}>
            <Text style={styles.headerText}>{item.name}</Text>
            <Text>Kategorija: {item.category}</Text>
            <Text>Cena: {item.price} RSD</Text>

            {/* OBRISATI NAKON TESTIRANJA */}
            {/* <Text>TOTAL STOCK: {item.totalStock}</Text> */}

            {!onStock && <Text style={styles.soldText}>RASPRODATO</Text>}
            {onStock && <Text style={styles.onStockText}>DOSTUPNO</Text>}
          </View>

          {batchMode ? (
            <>
              {isHighlighted && (
                <IconButton
                  size={26}
                  color={Colors.secondaryDark}
                  onPress={() => onRemoveHighlight(item, item.stockType)}
                  key={`key-${item._id}-add-button`}
                  icon="check"
                  style={[styles.addButtonContainer, { backgroundColor: '#9FB7C6' }]}
                  pressedStyles={styles.buttonContainerPressed}
                />
              )}
            </>
          ) : (
            <>
              {onStock && user?.permissions?.products?.create && showAddBtn && (
                <IconButton
                  size={26}
                  color={Colors.secondaryDark}
                  onPress={handleOnAddPress}
                  key={`key-${item._id}-add-button`}
                  icon="add"
                  style={styles.addButtonContainer}
                  pressedStyles={styles.buttonContainerPressed}
                />
              )}
              {user?.permissions?.products?.update && (
                <IconButton
                  size={26}
                  color={Colors.secondaryDark}
                  onPress={handleOnEditPress}
                  key={`key-${item._id}-edit-button`}
                  icon="edit"
                  style={styles.editButtonContainer}
                  pressedStyles={styles.buttonContainerPressed}
                />
              )}
            </>
          )}
        </View>

        {/* STOCK DATA */}
        <View style={[styles.stockDataContainer]}>
          {/* DISPLAY DRESSES STOCK */}
          {item && item.stockType === 'Boja-Veličina-Količina' && (
            <DisplayDressStock isExpanded={isExpanded} item={item as DressTypes} />
          )}

          {/* DISPLAY PURSES STOCK */}
          {item && item.stockType === 'Boja-Količina' && (
            <DisplayPurseStock isExpanded={isExpanded} item={item as PurseTypes} />
          )}
        </View>
        {item.supplier && isExpanded && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Dobavljač: </Text>
            <Text style={styles.descriptionText}>{item.supplier}</Text>
          </View>
        )}
        {item.description && isExpanded && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Opis: </Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function getStyles(onStock: boolean, isHighlighted: boolean, showAddBtn: boolean) {
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
      alignItems: 'center',
      overflow: 'hidden',
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
      position: 'relative',
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
      overflow: 'hidden',
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

    // STOCK DATA CONTAINER
    stockDataContainer: {
      width: '100%',
      paddingHorizontal: 6,
      flexDirection: 'column',
      alignSelf: 'flex-start',
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
      elevation: 2,
    },
    editButtonContainer: {
      position: 'absolute',
      right: 8,
      top: onStock ? (showAddBtn ? 56 : 0) : 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      padding: 10,
      elevation: 2,
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
      pointerEvents: 'none',
    },
  });
}

export default DisplayProduct;
