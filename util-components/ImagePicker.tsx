import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalStyles } from '../constants/globalStyles';
import { useExpandAnimation } from '../hooks/useExpand';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import { useUser } from '../store/user-context';
import { pickImage } from '../util-methods/GalleryPickImage';
import Button from './Button';
import CustomText from './CustomText';
import { popupMessage } from './PopupMessage';

interface PropTypes {
  onTakeImage: (img: any) => void;
  previewImage: any;
  setPreviewImage: (img: any) => void;
  height?: number;
  resizeMode?: string;
  showCamera?: boolean;
  showGallery?: boolean;
  containerStyles?: any;
  enableImageCropping?: boolean;
  useAspectRatioWhileCropping?: boolean;
}

function ImagePicker({
  onTakeImage,
  previewImage,
  setPreviewImage,
  height = 400,
  resizeMode = 'contain',
  showCamera = true,
  showGallery = true,
  containerStyles,
  enableImageCropping = true,
  useAspectRatioWhileCropping = false,
}: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  const [permissionInfo, requestPermission] = useCameraPermissions();
  const [isExpanded, setIsExpanded] = useState(previewImage ? true : false);
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 50, height, 180);
  const { user, getUserValueForField } = useUser();

  async function verifyPermissions() {
    if (permissionInfo?.status === PermissionStatus.UNDETERMINED) {
      const permissionsResponse = await requestPermission();
      return permissionsResponse.granted;
    }
    if (permissionInfo?.status === PermissionStatus.DENIED) {
      popupMessage('Ova permisija je neophodna za pravilan rad aplikacije!', 'warning');
      const permissionsResponse = await requestPermission();
      return false;
    }
    return true;
  }

  // USE CAMERA
  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      aspect: [3, 4],
    });

    if (!image?.assets?.[0]) return;
    setPreviewImage(image?.assets?.[0]);
    onTakeImage(image?.assets?.[0]);
    setIsExpanded(true);
  }

  // PICK FROM GALLERY
  async function openGalleryHandler() {
    // const pickedImage = await pickImage(0.6, true, getUserValueForField('useAspectRatioForProductImage', true));
    const pickedImage = await pickImage(0.6, true, false);
    if (!pickedImage) return;
    setPreviewImage(pickedImage);
    onTakeImage(pickedImage);
    setIsExpanded(true);
  }

  function handleToggleExpand(event: any) {
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <CustomText style={styles.text}>Dodaj sliku proizvoda</CustomText>;
  if (!isExpanded) {
    imagePreview = (
      <Pressable onPress={handleToggleExpand} style={styles.collapsedArea}>
        {/* <Text style={styles.collapsedText}>Klikni za pregled slike</Text> */}
      </Pressable>
    );
  }
  if (previewImage && isExpanded) {
    imagePreview = <Image source={{ uri: previewImage.uri }} style={styles.image} resizeMode="contain" />;
  }

  return (
    <View>
      <Pressable onPress={takeImageHandler}>
        <Animated.View style={[styles.imagePreview, { height: toggleExpandAnimation }, containerStyles]}>
          <Pressable style={[styles.toggleExpand, globalStyles.border]} onPress={handleToggleExpand}>
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.defaultText} />
          </Pressable>
          {imagePreview}
        </Animated.View>
      </Pressable>
      <View style={styles.buttonsContainer}>
        {showCamera && (
          <Button
            onPress={takeImageHandler}
            containerStyles={[styles.button, globalStyles.border]}
            textStyles={styles.buttonText}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
          >
            <Icon name="camera" size={24} color={colors.defaultText} />
          </Button>
        )}
        {showGallery && (
          <Button
            onPress={openGalleryHandler}
            containerStyles={[styles.button, globalStyles.border]}
            textStyles={styles.buttonText}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
          >
            <Icon name="image" size={24} color={colors.defaultText} />
          </Button>
        )}
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    imagePreview: {
      width: '100%',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      marginTop: 4,
      padding: 10,
    },
    image: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: colors.background1,
    },
    text: {
      fontSize: 16,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10,
      flex: 1,
    },
    button: {
      padding: 0.5,
      flex: 2,
    },
    buttonText: {
      fontWeight: 400,
      fontSize: 14,
    },
    toggleExpand: {
      backgroundColor: colors.background,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
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

export default ImagePicker;
