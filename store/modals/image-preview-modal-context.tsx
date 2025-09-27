import React, { createContext, useContext, useState, ReactNode } from 'react';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

type ConfirmCallback = () => void | Promise<void>;

interface ImagePreviewModalContextType {
  showImagePreview: (
    callback: ConfirmCallback,
    imageUri?: string,
    title?: string,
  ) => void;
}

const ImagePreviewModalContext = createContext<
  ImagePreviewModalContextType | undefined
>(undefined);

export function useImagePreviewModal() {
  const context = useContext(ImagePreviewModalContext);
  if (!context)
    throw new Error(
      'useImagePreviewModal must be used within ImagePreviewModalProvider',
    );
  return context;
}

export const ImagePreviewModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');

  const showImagePreview = (callback: ConfirmCallback, imageUri, title) => {
    setImageUri(imageUri);
    setTitle(title);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ImagePreviewModalContext.Provider value={{ showImagePreview }}>
      {children}
      <ImagePreviewModal
        isVisible={isModalVisible}
        onCancel={hideModal}
        title={title}
        imgUri={imageUri}
      />
    </ImagePreviewModalContext.Provider>
  );
};
