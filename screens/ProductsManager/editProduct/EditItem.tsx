import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
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
    <>
      {editedProduct === null ? (
        <Animated.View>
          <Animated.View style={[overlayView, styles.overlayView]} />
          <DisplayProducts setEditItem={setEditedProduct} showAddBtn={false} />
        </Animated.View>
      ) : (
        <Animated.View style={editProductFade}>
          <EditProductComponent item={editedProduct} setItem={setEditedProduct} showHeader={false} />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlayView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'white',
    pointerEvents: 'none',
  },
});

export default EditItem;
