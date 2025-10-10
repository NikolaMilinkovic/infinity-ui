import React, { useState } from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../../hooks/useFadeTransition';
import { ProductTypes } from '../../../types/allTsTypes';
import AppUpadteModal from '../../../util-components/AppUpadteModal';

function BrowseProducts() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct() {
    setEditedProduct(null);
  }

  return (
    <Animated.View style={{ flex: 1 }}>
      <View>
        {/* <Button onPress={fetchAllProducts}>FETCH PRODUCTS</Button> */}
        {/* <SocketDcRc /> */}
        <AppUpadteModal />
        <DisplayProducts setEditItem={setEditedProduct} />
      </View>
      <Modal
        animationType="slide"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        presentationStyle="overFullScreen"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.ScrollView contentContainerStyle={[editProductFade]}>
            <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} />
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </Animated.View>
  );
}

export default BrowseProducts;
