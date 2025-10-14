import { useState } from 'react';
import { Modal } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeView from '../../../components/layout/SafeView';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../../hooks/useFadeTransition';
import { ProductTypes } from '../../../types/allTsTypes';

function EditItem() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct() {
    setEditedProduct(null);
  }

  return (
    <SafeView>
      <Animated.View>
        <DisplayProducts setEditItem={setEditedProduct} showAddBtn={false} />
      </Animated.View>

      <Modal
        animationType="fade"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        presentationStyle="overFullScreen"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.ScrollView contentContainerStyle={[editProductFade]}>
            {editedProduct && (
              <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} showHeader={false} />
            )}
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeView>
  );
}

export default EditItem;
