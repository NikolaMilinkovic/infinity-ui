import React, { useState } from 'react';
import { Modal, SafeAreaView } from 'react-native';
import Animated from 'react-native-reanimated';
import SafeView from '../../../components/layout/SafeView';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition, useFadeTransitionReversed } from '../../../hooks/useFadeTransition';
import { ProductTypes } from '../../../types/allTsTypes';

function EditItem() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  const overlayView = useFadeTransitionReversed(editedProduct === null, 500, 150);
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
            <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} showHeader={false} />
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeView>
  );
}

export default EditItem;
