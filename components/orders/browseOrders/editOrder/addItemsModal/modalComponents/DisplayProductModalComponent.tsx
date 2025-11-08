import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import useCheckStockAvailability from '../../../../../../hooks/useCheckStockAvailability';
import useImagePreviewModal from '../../../../../../hooks/useImagePreviewModal';
import { ThemeColors, useThemeColors } from '../../../../../../store/theme-context';
import { DressTypes, ImageTypes, ProductTypes, PurseTypes } from '../../../../../../types/allTsTypes';
import IconButton from '../../../../../../util-components/IconButton';
import ImagePreviewModal from '../../../../../../util-components/ImagePreviewModal';
import DisplayDressStock from '../../../../../products/unique_product_components/display_stock/DisplayDressStock';
import DisplayPurseStock from '../../../../../products/unique_product_components/display_stock/DisplayPurseStock';

// DISPLAYS A SINGLE PRODUCT IN THE LIST
interface DisplayProductModalComponentPropTypes {
  item: ProductTypes;
  addNewProduct: (item: any) => void;
}
export default function DisplayProductModalComponent({ item, addNewProduct }: DisplayProductModalComponentPropTypes) {
  const [previewImage, setPreviewImage] = useState(item.image);
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [onStock, setOnStock] = useState(false);
  if (item) useCheckStockAvailability(item, setOnStock);
  const colors = useThemeColors();
  const styles = getStyles(colors, onStock);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleOnAddPress = () => {
    let productObj;
    if (item.stockType === 'Boja-Veličina-Količina') {
      productObj = {
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
    } else {
      productObj = {
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
    }
    addNewProduct(productObj);
  };
  function handleImagePreview(image: ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }
  return (
    <Pressable style={styles.itemContainer} onPress={toggleExpand}>
      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
      )}

      {/* IMAGE AND INFO */}
      <View style={styles.infoContainer}>
        {/* Stop parent press here */}
        <Pressable style={styles.imageContainer} onPress={() => handleImagePreview(item.image)}>
          <Image source={{ uri: item.image.uri }} style={styles.image} />
        </Pressable>

        <View style={styles.info}>
          <Text style={styles.headerText} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text>Kategorija: {item.category}</Text>
          <Text>Cena: {item.price} RSD</Text>

          {!onStock && <Text style={styles.soldText}>RASPRODATO</Text>}
        </View>

        {/* Stop parent press here */}
        {onStock && (
          <IconButton
            onPress={handleOnAddPress}
            size={26}
            color={colors.secondaryDark}
            key={`key-${item._id}-add-button`}
            icon="add"
            style={styles.addButtonContainer}
            backColor="transparent"
            backColor1="transparent"
          />
        )}
      </View>

      {/* STOCK DATA */}
      <View style={styles.stockDataContainer}>
        {item?.stockType === 'Boja-Veličina-Količina' && (
          <DisplayDressStock isExpanded={isExpanded} item={item as DressTypes} />
        )}
        {item?.stockType === 'Boja-Količina' && <DisplayPurseStock isExpanded={isExpanded} item={item as PurseTypes} />}
      </View>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors, onStock: boolean) {
  return StyleSheet.create({
    itemContainer: {
      minHeight: 160,
      padding: 6,
      paddingVertical: 10,
      width: '100%',
      borderBottomWidth: 0.5,
      borderColor: colors.highlight,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: onStock ? colors.background : colors.outOfStockBackground,
      marginBottom: 2,
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
      marginRight: 40,
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
      color: colors.defaultText,
      maxHeight: 40,
    },
    soldText: {
      color: colors.error,
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
      backgroundColor: onStock ? colors.background : colors.outOfStockBackground,
      borderColor: onStock ? colors.success1 : colors.error,
      borderWidth: 0,
      width: '100%',
    },
    expandButtonIcon: {
      color: onStock ? colors.success1 : colors.error,
    },
    stockDataContainer: {
      width: '100%',
      paddingHorizontal: 6,
    },
    onStockText: {
      color: colors.success1,
      fontWeight: 'bold',
    },
    addButtonContainer: {
      position: 'absolute',
      right: 8,
      top: 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: onStock ? colors.background : colors.outOfStockBackground,
      padding: 10,
    },
  });
}
