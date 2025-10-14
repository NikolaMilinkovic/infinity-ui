import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeView from '../../../components/layout/SafeView';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import { Colors } from '../../../constants/colors';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../../hooks/useFadeTransition';
import { ProductTypes } from '../../../types/allTsTypes';
import AppUpadteModal from '../../../util-components/AppUpadteModal';
import KeyboardAvoidingWrapper from '../../../util-components/KeyboardAvoidingWrapper';

function BrowseProducts() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct() {
    setEditedProduct(null);
  }

  return (
    <>
      <SafeView>
        <Animated.View style={{ flex: 1 }}>
          <View>
            {/* <Button onPress={fetchAllProducts}>FETCH PRODUCTS</Button> */}
            {/* <SocketDcRc /> */}
            <AppUpadteModal />
            <DisplayProducts setEditItem={setEditedProduct} />
          </View>
        </Animated.View>
      </SafeView>
      <Modal
        animationType="fade"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        presentationStyle="overFullScreen"
      >
        <KeyboardAvoidingWrapper>
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryDark }}>
            <StatusBar style="light" />
            <Animated.ScrollView contentContainerStyle={[editProductFade]}>
              {editedProduct && <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} />}
            </Animated.ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingWrapper>
      </Modal>
    </>
  );
}

export default BrowseProducts;
