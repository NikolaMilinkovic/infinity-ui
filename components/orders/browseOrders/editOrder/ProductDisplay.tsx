import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalStyles } from '../../../../constants/globalStyles';
import useConfirmationModal from '../../../../hooks/useConfirmationMondal';
import useImagePreviewModal from '../../../../hooks/useImagePreviewModal';
import { ThemeColors, useThemeColors } from '../../../../store/theme-context';
import { OrderProductTypes } from '../../../../types/allTsTypes';
import ConfirmationModal from '../../../../util-components/ConfirmationModal';
import CustomText from '../../../../util-components/CustomText';
import IconButton from '../../../../util-components/IconButton';
import ImagePreviewModal from '../../../../util-components/ImagePreviewModal';

interface ProductDisplayTypes {
  product: OrderProductTypes;
  index: number;
  setProducts: (product: OrderProductTypes) => void;
}
function ProductDisplay({ product, index, setProducts }: ProductDisplayTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const previewImage = product?.image;
  function handleImagePreview() {
    showImageModal();
  }

  // REMOVE PRODUCTS HANDLER
  async function handleOnRemovePress() {
    showModal(async () => {
      setProducts((prevProducts: OrderProductTypes) => [
        ...prevProducts.slice(0, index),
        ...prevProducts.slice(index + 1),
      ]);
    });
  }
  return (
    <>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={hideModal}
        message="Da li sigurno želiš da obrišeš selektovani proizvod iz porudžbine?"
      />
      {previewImage && (
        <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
      )}

      <View key={index} style={[styles.container, globalStyles.border, globalStyles.elevation_1]}>
        <View style={styles.subContainer}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Pressable onPress={handleImagePreview}>
              <Image source={{ uri: product.image.uri }} style={styles.image} resizeMode="contain" />
            </Pressable>
          </View>

          {/* Main data */}
          <View style={styles.infoContainer}>
            <CustomText style={styles.header}>{product.name}</CustomText>

            {/* Category */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kategorija:</Text>
              <Text style={styles.infoText}>{product.category}</Text>
            </View>

            {/* Price */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cena:</Text>
              <Text style={styles.infoText}>{product.price} rsd.</Text>
            </View>

            {/* Color */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Boja:</Text>
              <Text style={styles.infoText}>{product.selectedColor}</Text>
            </View>

            {/* Size */}
            {product.selectedSize && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Veličina:</Text>
                <Text style={styles.infoText}>{product.selectedSize}</Text>
              </View>
            )}

            {/* Delete button */}
            <IconButton
              size={26}
              color={colors.error}
              onPress={handleOnRemovePress}
              key={`key-${index}-remove-button`}
              icon="delete"
              style={styles.removeButtonContainer}
              pressedStyles={styles.buttonContainerPressed}
              backColor={'transparent'}
              backColor1={'transparent'}
            />
          </View>
        </View>
      </View>
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: 10,
    },
    subContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    imageContainer: {
      flex: 1.5,
    },
    infoContainer: {
      flex: 3,
      position: 'relative',
    },
    header: {
      fontSize: 16,
      color: colors.defaultText,
    },
    image: {
      height: 140,
      borderRadius: 4,
    },
    removeButtonContainer: {
      position: 'absolute',
      right: 8,
      bottom: 0,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: colors.background,
      padding: 10,
    },
    buttonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    },
    infoRow: {
      maxWidth: '75%',
      flexDirection: 'row',
    },
    infoLabel: {
      width: 75,
      color: colors.defaultText,
    },
    infoText: {
      width: '55%',
      color: colors.defaultText,
    },
  });
}

export default ProductDisplay;
