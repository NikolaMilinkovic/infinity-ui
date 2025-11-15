import { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';

interface DisplayOrderProductPropTypes {
  product: any;
  index?: number;
  grayedText?: boolean;
}

function DisplayOrderProduct({ product, index, grayedText = false }: DisplayOrderProductPropTypes) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(product?.image);
  const colors = useThemeColors();
  const styles = getStyles(colors, grayedText);
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
          <CustomText variant="medium" style={styles.label}>
            Naziv:
          </CustomText>
          <CustomText style={styles.data} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </CustomText>
        </View>
        <View style={styles.row}>
          <CustomText variant="medium" style={styles.label}>
            Boja:
          </CustomText>
          <CustomText
            style={[styles.data, { color: colors.defaultText }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="bold"
          >
            {product.selectedColor}
          </CustomText>
        </View>
        {product.selectedSize && (
          <View style={styles.row}>
            <CustomText variant="medium" style={styles.label}>
              Veličina:
            </CustomText>
            <CustomText
              style={[styles.data, { color: colors.defaultText }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              variant="bold"
            >
              {product.selectedSize}
            </CustomText>
          </View>
        )}
        <View style={styles.row}>
          <CustomText variant="medium" style={styles.label}>
            Cena:
          </CustomText>
          <CustomText style={styles.data} numberOfLines={1} ellipsizeMode="tail">
            {product.price} rsd.
          </CustomText>
        </View>
      </View>
    </Animated.View>
  );
}

function getStyles(colors: ThemeColors, grayedText: boolean) {
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
      color: grayedText ? colors.grayText : colors.defaultText,
    },
    data: {
      color: grayedText ? colors.grayText : colors.defaultText,
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
