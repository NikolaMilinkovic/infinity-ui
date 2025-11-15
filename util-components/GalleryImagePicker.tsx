import { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimation } from '../hooks/useExpand';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import { ProductImageTypes } from '../types/allTsTypes';
import { pickImage } from '../util-methods/GalleryPickImage';
import CustomText from './CustomText';

interface PropTypes {
  image: ProductImageTypes | null;
  setImage: (image: ProductImageTypes | null) => void;
  placeholder: string;
  quality: number;
  customStyles?: any;
  textStyles?: any;
  enableImageCropping: boolean;
  useAspectRatioWhileCropping: boolean;
}

function GalleryImagePicker({
  image,
  setImage,
  placeholder = 'Dodaj sliku',
  quality = 0.6,
  customStyles,
  textStyles,
  enableImageCropping = false,
  useAspectRatioWhileCropping = false,
}: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [isExpanded, setIsExpanded] = useState(true);
  const toggledHeight = useExpandAnimation(isExpanded, 50, 100, 180);

  async function handlePickImage() {
    const pickedImage = await pickImage(quality, enableImageCropping, useAspectRatioWhileCropping);
    if (pickedImage) {
      setImage(pickedImage as any);
      setIsExpanded(true);
    }
  }

  function handleToggleExpand(event: any) {
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <CustomText style={[styles.text, textStyles]}>{placeholder}</CustomText>;
  if (!isExpanded) {
    imagePreview = <Pressable onPress={handleToggleExpand} style={styles.collapsedArea}></Pressable>;
  }
  if (image && isExpanded) {
    imagePreview = <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />;
  }

  return (
    <>
      {/* <Button onPress={handlePickImage} containerStyles={styles.button} textStyles={styles.buttonText}>
        <Icon name="image" size={24} color={colors.primaryDark} />
      </Button> */}

      <Pressable onPress={() => handlePickImage()}>
        <Animated.View style={[styles.imagePreview, customStyles, { height: toggledHeight }]}>
          {/* <Pressable style={styles.toggleExpand} onPress={handleToggleExpand}>
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
          </Pressable> */}
          {imagePreview}
        </Animated.View>
      </Pressable>
    </>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    imagePreview: {
      width: '100%',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      marginTop: 4,
    },
    image: {
      width: '100%',
      height: 100,
      backgroundColor: colors.background,
    },
    text: {
      fontSize: 16,
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.defaultText,
    },
    button: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      color: colors.defaultText,
    },
    buttonText: {
      fontWeight: 400,
      fontSize: 16,
    },
    toggleExpand: {
      backgroundColor: colors.background,
      borderRadius: 4,
      borderColor: colors.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      elevation: 2,
    },
    collapsedArea: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    collapsedText: {
      fontSize: 16,
    },
  });
}

export default GalleryImagePicker;
