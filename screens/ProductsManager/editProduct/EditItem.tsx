import React, { useState } from 'react';
import DisplayEditableProducts from '../../../components/products/edit_product/DisplayEditableProducts';
import { ProductTypes } from '../../../types/allTsTypes';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import Animated from 'react-native-reanimated';
import { useFadeTransition, useFadeTransitionReversed } from '../../../hooks/useFadeTransition';
import { StyleSheet } from 'react-native';
import DisplayProducts from '../../../components/products/DisplayProducts';
import useBackClickHandler from '../../../hooks/useBackClickHandler';

function EditItem() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  const editProductFade = useFadeTransition(editedProduct !== null);
  const overlayView = useFadeTransitionReversed(editedProduct === null, 500, 150);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct(){
    setEditedProduct(null);
  }

  return (
    <>
      {editedProduct === null ? (
        <Animated.View>
          <Animated.View style={[overlayView, styles.overlayView]} />
          <DisplayProducts setEditItem={setEditedProduct} />
        </Animated.View>
      ) : (
        <Animated.View style={editProductFade}>
          <EditProductComponent item={editedProduct} setItem={setEditedProduct} />
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
    pointerEvents: 'none'
  }
})

export default EditItem;
