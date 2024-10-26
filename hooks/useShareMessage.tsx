import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import { popupMessage } from '../util-components/PopupMessage';

interface PropTypes {
  message?: string;
  image?: {
    uri: string,
    imageName: string
  }
}

export const useShareMessage = async ({ message, image }: PropTypes) => {
  try {
    if (image) {
      // Step 1: Download the image locally
      const { uri: localUri } = await FileSystem.downloadAsync(
        image.uri,
        FileSystem.cacheDirectory + image.imageName
      );

      if (await Sharing.isAvailableAsync()) {
        const shareOptions = {
          dialogTitle: 'Share Item',
          UTI: 'public.jpeg',
          message: message || 'nema porukice',
        };
        await Sharing.shareAsync(localUri, shareOptions);
      } else {
        popupMessage('Deljenje nije moguće na ovom uređaju.', 'danger');
      }
    } else if (message) {
      if (await Sharing.isAvailableAsync()) {
        await Share.share({ message });
      } else {
        popupMessage('Deljenje nije moguće na ovom uređaju.', 'danger');
      }
    }
  } catch (error) {
    console.error(error);
    popupMessage('Došlo je do greške prilikom deljenja.', 'danger');
  }
};