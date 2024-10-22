import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, View, StyleSheet, Pressable, Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import { Colors } from '../constants/colors';
import { useExpandAnimation } from '../hooks/useExpand';
import { pickImage } from '../util-methods/GalleryPickImage';

interface PropTypes {
  image: string | null,
  setImage: (image: string | null) => void
}

function GalleryImagePicker({ image, setImage }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggledHeight = useExpandAnimation(isExpanded, 50, 100, 180);
  async function handlePickImage(){
    const pickedImage = await pickImage();
    if(pickedImage){
      setImage(pickedImage.uri);
      setIsExpanded(true);
    }
  }

  function handleToggleExpand(event:any){
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <Text style={styles.text}>Dodaj sliku proizvoda</Text>
  if(!isExpanded){
    imagePreview = (
      <Pressable onPress={handleToggleExpand} style={styles.collapsedArea}>
      </Pressable>
    )
  }
  if(image && isExpanded){
    imagePreview = <Image resizeMode="contain" source={{ uri: image }} style={styles.image}/>
  }

  return (
    <View>
      <Button 
        onPress={handlePickImage}
        containerStyles={styles.button}
        textStyles={styles.buttonText}
      >
          <Icon name='image' size={24} color={Colors.primaryDark}/>
      </Button>
      
      <Pressable onPress={handlePickImage}>
        <Animated.View style={[styles.imagePreview, { height: toggledHeight }]}>
          <Pressable style={styles.toggleExpand} onPress={handleToggleExpand}>
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24}/>
          </Pressable>
          {imagePreview}
        </Animated.View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  imagePreview: {
    // flex: 1,
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.secondaryLight
  },
  text: {
    fontSize: 16,
  },
  button: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark
  },
  buttonText: {
    fontWeight: 400,
    fontSize: 16,
  },
  toggleExpand: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  collapsedArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedText: {
    fontSize: 16,
  }
});

export default GalleryImagePicker