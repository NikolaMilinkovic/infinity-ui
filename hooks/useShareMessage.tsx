import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { popupMessage } from '../util-components/PopupMessage';

interface PropTypes {
  message?: string;
  image?: {
    uri: string;
    imageName: string;
  };
}

export const useShareMessage = async ({ message, image }: PropTypes) => {
  try {
    if (image) {
      // Step 1: Download the image locally using legacy API
      const { uri: localUri } = await FileSystem.downloadAsync(image.uri, FileSystem.cacheDirectory + image.imageName);

      // Step 2: Share the image file using expo-sharing
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localUri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Image',
        });
      } else {
        popupMessage('Deljenje nije moguće na ovom uređaju.', 'danger');
      }
    } else if (message) {
      await Share.share({ message });
    }
  } catch (error) {
    console.error(error);
    popupMessage('Došlo je do greške prilikom deljenja.', 'danger');
  }
};
