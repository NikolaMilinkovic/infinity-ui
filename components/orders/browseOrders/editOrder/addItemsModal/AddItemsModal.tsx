import { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewArticleTabs from '../../../../../navigation/NewArticleTabs';
import { ThemeColors, useThemeColors } from '../../../../../store/theme-context';
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
  const colors = useThemeColors();
  const styles = getStyles(colors);

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
      animationType="fade"
      visible={isVisible}
      presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={styles.contentContainer}>
                  {/* <NavigationContainer independent={true}> */}
                  <NewArticleTabs setNewProducts={setNewProducts} newProducts={newProducts} />
                  {/* </NavigationContainer> */}
                  <View style={styles.buttonsContainer}>
                    <Button
                      containerStyles={styles.button}
                      backColor={colors.buttonNormal1}
                      backColor1={colors.buttonNormal2}
                      textColor={colors.defaultText}
                      onPress={handleCancel}
                    >
                      Odustani
                    </Button>
                    <Button
                      containerStyles={styles.button}
                      backColor={colors.buttonHighlight1}
                      backColor1={colors.buttonHighlight2}
                      textColor={colors.whiteText}
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
      </SafeAreaView>
    </Modal>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
      width: '95%',
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
      backgroundColor: colors.background,
      width: '100%',
      textAlign: 'center',
      paddingVertical: 10,
      borderBottomWidth: 2,
      borderBottomColor: colors.highlight,
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
}
