import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../../../../constants/colors';
import NewArticleTabs from '../../../../../navigation/NewArticleTabs';
import { OrderProductTypes } from '../../../../../types/allTsTypes';
import Button from '../../../../../util-components/Button';
import { popupMessage } from '../../../../../util-components/PopupMessage';

interface AddItemsModalPropTypes {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setProducts: (data: OrderProductTypes[]) => void;
}
export default function AddItemsModal({ isVisible, setIsVisible, setProducts }: AddItemsModalPropTypes) {
  const [newProducts, setNewProducts] = useState<OrderProductTypes[]>([]);

  function handleCancel() {
    setIsVisible(false);
  }

  function validateNewItemsData() {
    const isValid = newProducts.every((product) => {
      const hasSelectedColor = product.selectedColor !== undefined && product.selectedColor !== '';
      const hasSelectedSize = product.selectedSize !== undefined ? product.selectedSize !== '' : true;

      return hasSelectedColor && hasSelectedSize;
    });
    return isValid;
  }

  function handleSaveItems() {
    if (!validateNewItemsData()) return popupMessage('Niste izabrali boje | veličine za sve proizvode', 'danger');

    setNewProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => ({
        ...product,
        itemReference: product.itemReference._id || product.itemReference,
      }));
      // Update `products` with the modified `newProducts` values
      setProducts((prev) => [...prev, ...updatedProducts]);
      // Clear `newProducts` after saving
      return [];
    });
    setIsVisible(false);
  }

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={modalStyles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modal}>
              <View style={modalStyles.contentContainer}>
                <NavigationContainer independent={true}>
                  <NewArticleTabs setNewProducts={setNewProducts} newProducts={newProducts} />
                </NavigationContainer>
                <View style={modalStyles.buttonsContainer}>
                  <Button
                    containerStyles={modalStyles.button}
                    backColor={Colors.error}
                    textColor={Colors.white}
                    onPress={handleCancel}
                  >
                    Odustani
                  </Button>
                  <Button
                    containerStyles={modalStyles.button}
                    backColor={Colors.secondaryDark}
                    textColor={Colors.white}
                    onPress={handleSaveItems}
                  >
                    Sačuvaj
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  modal: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.secondaryLight,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.highlight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  button: {
    flex: 2,
  },
});
