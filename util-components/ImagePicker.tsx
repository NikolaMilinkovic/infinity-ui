import React, { useEffect, useRef, useState } from 'react'
import { Image, View, Text, StyleSheet, Pressable, Animated } from 'react-native'
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors'
import { popupMessage } from './PopupMessage'
import Button from './Button'
import { useExpandAnimation } from '../hooks/useExpand';
import { pickImage } from '../util-methods/GalleryPickImage';
import { betterConsoleLog } from '../util-methods/LogMethods';

interface PropTypes {
  onTakeImage: (img:any) => void
  previewImage: any
  setPreviewImage: (img:any) => void
}
function ImagePicker({ onTakeImage, previewImage, setPreviewImage }:PropTypes) {
  const [permissionInfo, requestPermission] = useCameraPermissions()
  const [isExpanded, setIsExpanded] = useState(previewImage ? true : false);
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 50, 400, 180);

  async function verifyPermissions(){
    if(permissionInfo?.status === PermissionStatus.UNDETERMINED){
      const permissionsResponse = await requestPermission();
      return permissionsResponse.granted;
    }
    if(permissionInfo?.status === PermissionStatus.DENIED){
      popupMessage('Ova permisija je neophodna za pravilan rad aplikacije!', 'warning');
      const permissionsResponse = await requestPermission();
      return false;
    }
    return true
  }

  async function takeImageHandler(){
    const hasPermission = await verifyPermissions();
    if(!hasPermission) return;

    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      aspect: [3, 4],
    })

    if(!image?.assets?.[0]) return;
    setPreviewImage(image?.assets?.[0]);
    onTakeImage(image?.assets?.[0]);
    setIsExpanded(true);
  }
  async function openGalleryHandler(){
    const pickedImage = await pickImage();
    betterConsoleLog('> Picked image',pickedImage);
    if(!pickedImage) return;
    setPreviewImage(pickedImage);
    onTakeImage(pickedImage);
    setIsExpanded(true);
  }

  function handleToggleExpand(event:any){
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <Text style={styles.text}>Dodaj sliku proizvoda</Text>
  if(!isExpanded){
    imagePreview = (
      <Pressable onPress={handleToggleExpand} style={styles.collapsedArea}>
        {/* <Text style={styles.collapsedText}>Klikni za pregled slike</Text> */}
      </Pressable>
    )
  }
  if(previewImage && isExpanded){
    imagePreview = <Image resizeMode="contain" source={{ uri: previewImage.uri }} style={styles.image}/>
  }

  return (
    <View>
      <Pressable onPress={takeImageHandler}>
        <Animated.View style={[styles.imagePreview, { height: toggleExpandAnimation }]}>
          <Pressable style={styles.toggleExpand} onPress={handleToggleExpand}>
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24}/>
          </Pressable>
          {imagePreview}
        </Animated.View>
      </Pressable>
      <View style={styles.buttonsContainer}>
        <Button 
          onPress={takeImageHandler}
          containerStyles={styles.button}
          textStyles={styles.buttonText}
        >
            <Icon name='camera' size={24} color={Colors.primaryDark}/>
        </Button>
        <Button 
          onPress={openGalleryHandler}
          containerStyles={styles.button}
          textStyles={styles.buttonText}
        >
            <Icon name='image' size={24} color={Colors.primaryDark}/>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    imagePreview: {
      flex: 1,
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
      height: '100%',
      backgroundColor: Colors.secondaryLight
    },
    text: {
      fontSize: 16,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10
    },
    button: {
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      flex: 1,
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
  })


export default ImagePicker