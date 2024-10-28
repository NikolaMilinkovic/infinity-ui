import React, { useState } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { betterConsoleLog } from '../../../util-methods/LogMethods'
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';
import { Colors } from '../../../constants/colors';

function DisplayOrderProduct({ product, index }) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(product?.image);
  function handleImagePreview() {
    setPreviewImage(product.image);
    showImageModal();
  }
  betterConsoleLog('> Product', product);
  return (
    <Animated.View style={styles.container}>
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          isVisible={isImageModalVisible}
          onCancel={hideImageModal}
        />
      )}
      {product && product.image && (
        <Pressable onPress={handleImagePreview}>
          <Image source={{ uri: product.image.uri }} style={styles.image}/>
        </Pressable>
      )}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.label}>Naziv:</Text>
          <Text style={styles.data}>{product.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Boja:</Text>
          <Text style={styles.data}>{product.selectedColor}</Text>
        </View>
        {product.selectedSize && (
            <View style={styles.row}>
            <Text style={styles.label}>Veličina:</Text>
            <Text style={styles.data}>{product.selectedSize}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Cena:</Text>
          <Text style={styles.data}>{product.price} din.</Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
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
    flexDirection: 'column'
  },
  label: {
    width: 70,
    fontWeight: 'bold'
  },
  data: {
  },
  text: {
  },
  image: {
    height: 80,
    width: 100,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  }
})

export default DisplayOrderProduct