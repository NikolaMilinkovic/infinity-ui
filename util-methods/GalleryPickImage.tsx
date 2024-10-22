import * as ImagePicker from 'expo-image-picker';

// PICK IMAGE FROM GALLERY
export const pickImage = async(quality:number = 0.2) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: quality,
  });

  if(!result.canceled){
    return result.assets[0]
  }
}