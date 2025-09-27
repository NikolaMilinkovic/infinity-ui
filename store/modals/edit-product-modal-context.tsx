import React, { createContext, useContext, useState, ReactNode } from 'react';
import ProductEditModal from '../../components/modals/ProductEditModal';
import { DressTypes, PurseTypes } from '../../global/types';

type ProductData = DressTypes | PurseTypes;
type ConfirmCallback = (updatedProduct: ProductData) => void | Promise<void>;

interface EditProductModalContextType {
  showEditModal: (product: ProductData, onConfirm: ConfirmCallback) => void;
}

const EditProductModalContext = createContext<
  EditProductModalContextType | undefined
>(undefined);

export function useEditProductModal() {
  const context = useContext(EditProductModalContext);
  if (!context)
    throw new Error(
      'useEditProductModal must be used within EditProductModalProvider',
    );
  return context;
}

export const EditProductModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [onConfirm, setOnConfirm] = useState<ConfirmCallback | null>(null);

  const showEditModal = (
    product: ProductData,
    confirmCallback: ConfirmCallback,
  ) => {
    setProductData(product);
    setOnConfirm(() => confirmCallback);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setProductData(null);
    setOnConfirm(null);
  };

  const confirmAction = async (updatedProduct: ProductData) => {
    if (onConfirm) await onConfirm(updatedProduct);
    hideModal();
  };

  return (
    <EditProductModalContext.Provider value={{ showEditModal }}>
      {children}
      {productData && (
        <ProductEditModal
          data={productData}
          isVisible={isModalVisible}
          onConfirm={confirmAction}
          onCancel={hideModal}
        />
      )}
    </EditProductModalContext.Provider>
  );
};
