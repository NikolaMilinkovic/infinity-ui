import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../../constants/colors';
import useConfirmationModal from '../../../../hooks/useConfirmationMondal';
import useImagePreviewModal from '../../../../hooks/useImagePreviewModal';
import { OrderProductTypes } from '../../../../types/allTsTypes';
import ConfirmationModal from '../../../../util-components/ConfirmationModal';
import IconButton from '../../../../util-components/IconButton';
import ImagePreviewModal from '../../../../util-components/ImagePreviewModal';

interface ProductDisplayTypes {
  product: OrderProductTypes;
  index: number;
  setProducts: (product: OrderProductTypes) => void;
}
function ProductDisplay({ product, index, setProducts }: ProductDisplayTypes) {
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

      <View key={index} style={productDisplayStyles.container}>
        <View style={productDisplayStyles.subContainer}>
          {/* Image */}
          <View style={productDisplayStyles.imageContainer}>
            <Pressable onPress={handleImagePreview}>
              <Image source={{ uri: product.image.uri }} style={productDisplayStyles.image} resizeMode="contain" />
            </Pressable>
          </View>

          {/* Main data */}
          <View style={productDisplayStyles.infoContainer}>
            <Text style={productDisplayStyles.header}>{product.name}</Text>

            {/* Category */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Kategorija:</Text>
              <Text style={productDisplayStyles.infoText}>{product.category}</Text>
            </View>

            {/* Price */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Cena:</Text>
              <Text style={productDisplayStyles.infoText}>{product.price} din.</Text>
            </View>

            {/* Color */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Boja:</Text>
              <Text style={productDisplayStyles.infoText}>{product.selectedColor}</Text>
            </View>

            {/* Size */}
            {product.selectedSize && (
              <View style={productDisplayStyles.infoRow}>
                <Text style={productDisplayStyles.infoLabel}>Veličina:</Text>
                <Text style={productDisplayStyles.infoText}>{product.selectedSize}</Text>
              </View>
            )}

            {/* Delete button */}
            <IconButton
              size={26}
              color={Colors.highlight}
              onPress={handleOnRemovePress}
              key={`key-${index}-remove-button`}
              icon="delete"
              style={productDisplayStyles.removeButtonContainer}
              pressedStyles={productDisplayStyles.buttonContainerPressed}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const productDisplayStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    elevation: 2,
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
    fontWeight: 'bold',
    fontSize: 16,
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
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2,
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
  },
  infoText: {
    width: '55%',
  },
});

export default ProductDisplay;
