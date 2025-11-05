import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import DisplayProducts from '../../../components/products/DisplayProducts';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../../hooks/useFadeTransition';
import { useThemeColors } from '../../../store/theme-context';
import { ProductTypes } from '../../../types/allTsTypes';
import AppUpadteModal from '../../../util-components/AppUpadteModal';

function BrowseProducts() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  const colors = useThemeColors();
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct() {
    setEditedProduct(null);
  }

  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }}>
        <View>
          <AppUpadteModal />
          <DisplayProducts setEditItem={setEditedProduct} />
        </View>
      </Animated.View>

      <Modal
        animationType="fade"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryDark }}>
          <StatusBar style="light" translucent={true} />
          <Animated.ScrollView style={[editProductFade, { flex: 1 }]} keyboardShouldPersistTaps="handled">
            {editedProduct && <EditProductComponent item={editedProduct as any} setItem={setEditedProduct} />}
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </Animated.View>
  );
}

export default BrowseProducts;
