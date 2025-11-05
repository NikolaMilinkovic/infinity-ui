import { useState } from 'react';
import { Modal, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../../hooks/useFadeTransition';
import { useThemeColors } from '../../../store/theme-context';
import { ProductTypes } from '../../../types/allTsTypes';

function EditItem() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct() {
    setEditedProduct(null);
  }
  const colors = useThemeColors();

  return (
    <>
      <DisplayProducts setEditItem={setEditedProduct} showAddBtn={false} />

      <Modal
        animationType="fade"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryDark }}>
          <Animated.ScrollView contentContainerStyle={[editProductFade]}>
            {editedProduct && (
              <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} showHeader={true} />
            )}
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default EditItem;
