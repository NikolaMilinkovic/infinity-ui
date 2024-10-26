import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DisplayEditableProducts from '../../../components/products/edit_product/DisplayEditableProducts';
import { ProductTypes } from '../../../types/allTsTypes';
import { betterConsoleLog } from '../../../util-methods/LogMethods';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import Animated from 'react-native-reanimated';
import { useFadeTransition, useFadeTransitionReversed } from '../../../hooks/useFadeTransition';
import { StyleSheet } from 'react-native';
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

function EditItem() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);
  
  const editProductFade = useFadeTransition(editedProduct !== null);
  const overlayView = useFadeTransitionReversed(editedProduct === null, 500, 150);
  const fadeAnimation = useFadeAnimation();

  return (
    <>
      {editedProduct === null ? (
        <Animated.View>
          <Animated.View style={[overlayView, styles.overlayView]} />
          <DisplayEditableProducts setEditedProduct={setEditedProduct} />
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
