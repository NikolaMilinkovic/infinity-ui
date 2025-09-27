import React, { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';

interface DisplayOrderProductPropTypes {
  product: any;
  index?: number;
  grayedText?: boolean;
}

function DisplayOrderProduct({ product, index, grayedText = false }: DisplayOrderProductPropTypes) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(product?.image);
  const styles = getStyles(grayedText);
  function handleImagePreview() {
    setPreviewImage(product.image);
    showImageModal();
  }

  return (
    <Animated.View style={styles.container}>
      {previewImage && (
        <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
      )}
      {product && product.image && (
        <Pressable onPress={handleImagePreview}>
          <Image source={{ uri: product.image.uri }} style={styles.image} />
        </Pressable>
      )}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.label}>Naziv:</Text>
          <Text style={styles.data} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Boja:</Text>
          <Text
            style={[styles.data, { fontWeight: 'bold', color: Colors.defaultText }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.selectedColor}
          </Text>
        </View>
        {product.selectedSize && (
          <View style={styles.row}>
            <Text style={styles.label}>Veličina:</Text>
            <Text
              style={[styles.data, { fontWeight: 'bold', color: Colors.defaultText }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {product.selectedSize}
            </Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Cena:</Text>
          <Text style={styles.data} numberOfLines={1} ellipsizeMode="tail">
            {product.price} din.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function getStyles(grayedText: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginLeft: 10,
      gap: 10,
      width: '100%',
      marginVertical: 4,
    },
    info: {
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      flex: 1,
    },
    label: {
      width: 70,
      fontWeight: 'bold',
      color: grayedText ? Colors.grayText : Colors.defaultText,
    },
    data: {
      color: grayedText ? Colors.grayText : Colors.defaultText,
      flexShrink: 1,
      flex: 1,
    },
    text: {},
    image: {
      height: 80,
      width: 100,
      borderRadius: 4,
    },
    row: {
      flexDirection: 'row',
    },
  });
}

export default DisplayOrderProduct;
