import React, { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { useExpandAnimation } from '../hooks/useExpand';
import { ProductImageTypes } from '../types/allTsTypes';
import { pickImage } from '../util-methods/GalleryPickImage';

interface PropTypes {
  image: ProductImageTypes | null;
  setImage: (image: ProductImageTypes | null) => void;
  placeholder: string;
  quality: number;
  crop: boolean;
  customStyles?: any;
}

function GalleryImagePicker({
  image,
  setImage,
  placeholder = 'Dodaj sliku',
  quality = 0.6,
  crop = false,
  customStyles,
}: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggledHeight = useExpandAnimation(isExpanded, 50, 100, 180);

  async function handlePickImage() {
    const pickedImage = await pickImage(quality, crop);
    if (pickedImage) {
      setImage(pickedImage);
      setIsExpanded(true);
    }
  }

  function handleToggleExpand(event: any) {
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <Text style={styles.text}>{placeholder}</Text>;
  if (!isExpanded) {
    imagePreview = <Pressable onPress={handleToggleExpand} style={styles.collapsedArea}></Pressable>;
  }
  if (image && isExpanded) {
    imagePreview = <Image resizeMode="contain" source={{ uri: image.uri }} style={styles.image} />;
  }

  return (
    <>
      {/* <Button onPress={handlePickImage} containerStyles={styles.button} textStyles={styles.buttonText}>
        <Icon name="image" size={24} color={Colors.primaryDark} />
      </Button> */}

      <Pressable onPress={handlePickImage}>
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

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    backgroundColor: Colors.white,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    backgroundColor: Colors.white,
  },
  buttonText: {
    fontWeight: 400,
    fontSize: 16,
  },
  toggleExpand: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderColor: Colors.primaryDark,
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

export default GalleryImagePicker;
