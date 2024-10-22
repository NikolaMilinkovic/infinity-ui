import * as ImagePicker from 'expo-image-picker';

// PICK IMAGE FROM GALLERY
export const pickImage = async() => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.4,
  });

  if(!result.canceled){
    return result.assets[0]
  }
}