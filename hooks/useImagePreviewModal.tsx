import { useState } from 'react';

function useImagePreviewModal() {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const showImageModal = () => {
    setIsImageModalVisible(true);
  };

  const hideImageModal = () => {
    setIsImageModalVisible(false);
  };

  return { isImageModalVisible, showImageModal, hideImageModal };
}

export default useImagePreviewModal;
