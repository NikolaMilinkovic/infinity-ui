import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { popupMessage } from '../util-components/PopupMessage';
import { betterErrorLog } from './LogMethods';

export const pickImage = async (
  quality = 0.6,
  allowsEditing = false,
  useAspect = false,
  aspectValue: [number, number] = [1, 1]
) => {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (newStatus !== 'granted') return null;
  }

  try {
    // ============================================[ ANDROID ]============================================
    if (Platform.OS === 'android') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing,
        quality,
        aspect: allowsEditing ? (useAspect ? aspectValue : undefined) : undefined,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: 'image',
          fileName: asset.fileName || asset.uri.split('/').pop(),
        };
      }
    } else {
      // ============================================[ iOS ]============================================
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: allowsEditing && useAspect ? aspectValue : undefined,
        quality,
        base64: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (!asset.assetId) {
          popupMessage('Došlo je do problema sa čitanjem slike.', 'danger');
          return null;
        }

        // Get local file path from PH asset using MediaLibrary
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.assetId);
        const localUri = assetInfo.localUri ?? asset.uri; // fallback to original URI

        return {
          uri: localUri,
          width: asset.width,
          height: asset.height,
          type: 'image',
          fileName: asset.fileName || asset.uri.split('/').pop(),
        };
      }
    }
  } catch (e) {
    betterErrorLog('> Picker Error', e);
    popupMessage('Došlo je do greške prilikom otvaranja galerije.', 'danger');
  }

  return null;
};
