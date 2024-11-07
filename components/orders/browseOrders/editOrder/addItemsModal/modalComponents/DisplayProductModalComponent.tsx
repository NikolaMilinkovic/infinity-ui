import { useState } from "react";
import { DressTypes, ImageTypes, ProductTypes, PurseTypes } from "../../../../../../types/allTsTypes";
import useImagePreviewModal from "../../../../../../hooks/useImagePreviewModal";
import useCheckStockAvailability from "../../../../../../hooks/useCheckStockAvailability";
import { Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import ImagePreviewModal from "../../../../../../util-components/ImagePreviewModal";
import ExpandButton from "../../../../../../util-components/ExpandButton";
import IconButton from "../../../../../../util-components/IconButton";
import { Colors } from "../../../../../../constants/colors";
import DisplayDressStock from "../../../../../products/unique_product_components/display_stock/DisplayDressStock";
import DisplayPurseStock from "../../../../../products/unique_product_components/display_stock/DisplayPurseStock";

// DISPLAYS A SINGLE PRODUCT IN THE LIST
interface DisplayProductModalComponentPropTypes {
  item: ProductTypes
  addNewProduct: (item: any) => void
}
export default function DisplayProductModalComponent({ item, addNewProduct }: DisplayProductModalComponentPropTypes){
  const [previewImage, setPreviewImage] = useState(item.image);
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [onStock, setOnStock] = useState(false);
  if(item) useCheckStockAvailability(item, setOnStock);
  const styles = getProductStyles(onStock);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleOnAddPress = () => {
    let productObj;
    if(item.stockType === 'Boja-Veličina-Količina'){
      productObj = {
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
    } else {
      productObj = {
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
    }
    addNewProduct(productObj);
  }
  function handleImagePreview(image: ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }
  return(
    <View style={styles.itemContainer}>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          isVisible={isImageModalVisible}
          onCancel={hideImageModal}
        />
      )}

      {/* IMAGE AND INFORMATIONS */}
      <View style={styles.infoContainer}>
        <Pressable style={styles.imageContainer} onPress={() => handleImagePreview(item.image)}>
          <Image source={{ uri: item.image.uri }} style={styles.image} />
        </Pressable>

        <TouchableWithoutFeedback>
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
        </TouchableWithoutFeedback>
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
    </View>
  )
}

function getProductStyles(onStock: boolean){

  return StyleSheet.create({
    itemContainer: {
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
      backgroundColor: onStock ? Colors.white : Colors.secondaryHighlight,
      padding: 10,
      elevation: 2
    },
  })
}