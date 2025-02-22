import React, { useContext, useEffect, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import DisplayProducts from '../../../components/products/DisplayProducts';
import { ProductTypes } from '../../../types/allTsTypes';
import EditProductComponent from '../../../components/products/edit_product/EditProductComponent';
import { useFadeTransition, useFadeTransitionReversed } from '../../../hooks/useFadeTransition';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import AppUpadteModal from '../../../util-components/AppUpadteModal';

function BrowseProducts() {
  const [editedProduct, setEditedProduct] = useState<ProductTypes | null>(null);

  const editProductFade = useFadeTransition(editedProduct !== null);
  const overlayView = useFadeTransitionReversed(editedProduct === null, 500, 150);
  useBackClickHandler(!!editedProduct, handleRemoveEditedProduct);
  function handleRemoveEditedProduct(){
    setEditedProduct(null);
  }  
  
  return (
    <>
      <View>
        <AppUpadteModal/>
        <Animated.View style={[overlayView, styles.overlayView]}/>
        <DisplayProducts
          setEditItem={setEditedProduct}
        />
      </View>
      <Modal
        animationType="slide"
        visible={editedProduct !== null}
        onRequestClose={handleRemoveEditedProduct}
        >
        <Animated.View style={editProductFade}>
          <EditProductComponent
            item={editedProduct}
            setItem={setEditedProduct}
          />
        </Animated.View>
      </Modal>
    </>
  )
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

export default BrowseProducts