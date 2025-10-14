import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { globalStyles } from '../constants/globalStyles';
import { useExpandAnimation } from '../hooks/useExpand';
import { pickImage } from '../util-methods/GalleryPickImage';
import Button from './Button';
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
}: PropTypes) {
  const [permissionInfo, requestPermission] = useCameraPermissions();
  const [isExpanded, setIsExpanded] = useState(previewImage ? true : false);
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 50, height, 180);

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
  async function openGalleryHandler() {
    const pickedImage = await pickImage(0.6, true);
    if (!pickedImage) return;
    setPreviewImage(pickedImage);
    onTakeImage(pickedImage);
    setIsExpanded(true);
  }

  function handleToggleExpand(event: any) {
    setIsExpanded(!isExpanded);
    event.stopPropagation();
  }

  let imagePreview = <Text style={styles.text}>Dodaj sliku proizvoda</Text>;
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
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
          </Pressable>
          {imagePreview}
        </Animated.View>
      </Pressable>
      <View style={styles.buttonsContainer}>
        {showCamera && (
          <Button
            onPress={takeImageHandler}
            containerStyles={[styles.button, globalStyles.elevation_1, globalStyles.border]}
            textStyles={styles.buttonText}
          >
            <Icon name="camera" size={24} color={Colors.primaryDark} />
          </Button>
        )}
        {showGallery && (
          <Button
            onPress={openGalleryHandler}
            containerStyles={[styles.button, globalStyles.elevation_1, globalStyles.border]}
            textStyles={styles.buttonText}
          >
            <Icon name="image" size={24} color={Colors.primaryDark} />
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    fontWeight: 400,
    fontSize: 16,
  },
  toggleExpand: {
    backgroundColor: Colors.white,
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

export default ImagePicker;
