import { useContext, useEffect, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalStyles } from '../../../constants/globalStyles';
import useCheckStockAvailability from '../../../hooks/useCheckStockAvailability';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useHighlightAnimation } from '../../../hooks/useHighlightAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import { DressTypes, ImageTypes, PurseTypes } from '../../../types/allTsTypes';
import CustomText from '../../../util-components/CustomText';
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

  const colors = useThemeColors();
  const styles = getStyles(colors, onStock, showAddBtn);
  const globalStyles = useGlobalStyles();
  if (item) useCheckStockAvailability(item, setOnStock);
  const { user } = useUser();

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
    if (item.totalStock === 0) return popupMessage('Ovog proizvoda više nema na lageru!', 'danger');
    item.totalStock--;

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
    // highlightColor: '#A3B9CC',
    highlightColor: colors.selectedProductBackground,
  });

  return (
    <Pressable
      key={item._id}
      onPress={toggleExpand}
      delayLongPress={200}
      onLongPress={() => handleLongPress(item._id, item.stockType)}
    >
      <Animated.View
        style={[
          styles.container,
          {
            maxHeight: expandHeight,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {/* IMAGE AND INFORMATIONS */}
        <View style={styles.infoContainer}>
          <Pressable style={styles.imageContainer} onPress={() => showImagePreview(item.image as any)}>
            <Image source={{ uri: item.image.uri }} style={styles.image} />
          </Pressable>

          <View style={styles.info}>
            <Text
              style={[globalStyles.header, { fontSize: 14.5, marginBottom: 6, marginTop: 6, maxWidth: '82%' }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <CustomText style={(globalStyles.textRegular, { fontSize: 13 })}>Kategorija: {item.category}</CustomText>
            <CustomText style={(globalStyles.textRegular, { fontSize: 13 })}>Cena: {item.price} RSD</CustomText>

            {!onStock && (
              <CustomText style={styles.soldText} variant="bold">
                RASPRODATO
              </CustomText>
            )}
            {onStock && (
              <CustomText style={styles.onStockText} variant="bold">
                DOSTUPNO ({item.totalStock})
              </CustomText>
            )}
          </View>

          {batchMode ? (
            <>
              {/* HIGHLIGHT REMOVE */}
              {isHighlighted && (
                <IconButton
                  size={26}
                  color={colors.defaultText}
                  onPress={() => onRemoveHighlight(item, item.stockType)}
                  key={`key-${item._id}-add-button`}
                  icon="check"
                  style={[styles.highlightRemoveBtnContainer]}
                  pressedStyles={styles.buttonContainerPressed}
                  backColor={'transparent'}
                  backColor1={'transparent'}
                />
              )}
            </>
          ) : (
            <>
              {/* ADD */}
              {onStock && user?.permissions?.products?.create && showAddBtn && (
                <IconButton
                  size={22}
                  color={colors.iconColor}
                  onPress={handleOnAddPress}
                  key={`key-${item._id}-add-button`}
                  icon="add"
                  style={[styles.addButtonContainer]}
                  pressedStyles={styles.buttonContainerPressed}
                  backColor={'transparent'}
                  backColor1={'transparent'}
                />
              )}

              {/* EDIT */}
              {user?.permissions?.products?.update && (
                <IconButton
                  size={22}
                  color={colors.iconColor}
                  onPress={handleOnEditPress}
                  key={`key-${item._id}-edit-button`}
                  icon="edit"
                  style={[styles.editButtonContainer]}
                  pressedStyles={styles.buttonContainerPressed}
                  backColor={'transparent'}
                  backColor1={'transparent'}
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
            <CustomText style={styles.descriptionLabel} variant="bold">
              Dobavljač:{' '}
            </CustomText>
            <CustomText style={styles.descriptionText}>{item.supplier}</CustomText>
          </View>
        )}
        {item.description && isExpanded && (
          <View style={styles.descriptionContainer}>
            <CustomText style={styles.descriptionLabel} variant="bold">
              Opis:{' '}
            </CustomText>
            <CustomText style={styles.descriptionText}>{item.description}</CustomText>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors, onStock: boolean, showAddBtn: boolean) {
  return StyleSheet.create({
    descriptionContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    descriptionLabel: {
      minWidth: 80,
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
      borderColor: colors.borderColor,
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: 1,
      position: 'relative',
      elevation: 1,
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
      borderRadius: 4,
      overflow: 'hidden',
      borderColor: colors.borderColor,
      borderWidth: 0,
      padding: 0,
    },
    image: {
      flex: 4,
      width: 120,
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.defaultText,
      maxHeight: 40,
      maxWidth: '85%',
    },
    soldText: {
      color: colors.error,
      marginTop: 'auto',
      marginLeft: 'auto',
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
      borderColor: onStock ? colors.success : colors.error,
      borderWidth: 0,
      width: '100%',
    },
    expandButtonIcon: {
      color: onStock ? colors.success : colors.error,
    },

    // STOCK DATA CONTAINER
    stockDataContainer: {
      width: '100%',
      paddingHorizontal: 6,
      flexDirection: 'column',
      alignSelf: 'flex-start',
    },
    onStockText: {
      color: colors.success1,
      fontSize: 13,
      marginBottom: 10,
      marginTop: 'auto',
      marginLeft: 'auto',
    },
    highlightRemoveBtnContainer: {
      position: 'absolute',
      right: 8,
      top: 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: colors.selectedProductButtonBackground,
      padding: 10,
    },
    addButtonContainer: {
      position: 'absolute',
      right: 8,
      top: 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: onStock ? colors.background : colors.outOfStockButtonColor,
      padding: 10,
    },
    editButtonContainer: {
      position: 'absolute',
      right: 8,
      top: onStock ? (showAddBtn ? 56 : 0) : 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: onStock ? colors.background : colors.background,
      padding: 10,
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
      backgroundColor: colors.background,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none',
    },
  });
}

export default DisplayProduct;
