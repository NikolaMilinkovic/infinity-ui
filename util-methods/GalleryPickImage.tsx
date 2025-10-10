import * as ImagePicker from 'expo-image-picker';

// PICK IMAGE FROM GALLERY
export const pickImage = async (
  quality: number = 0.6,
  allowsEditing = false,
  useAspect = false,
  aspectValue: [number, number] = [1, 1]
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: allowsEditing,
    quality: quality,
    aspect: allowsEditing ? (useAspect ? aspectValue : undefined) : undefined,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
};
