import React, { useEffect, useState } from 'react'
import { Animated, Image, Pressable, Text, View } from 'react-native'
import { betterConsoleLog } from '../../../util-methods/LogMethods'
import { OrderTypes } from '../../../types/allTsTypes';
import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { getFormattedDate } from '../../../util-methods/DateFormatters';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import { useExpandAnimation } from '../../../hooks/useExpand';
import DisplayOrderProduct from './DisplayOrderProduct';
import IconButton from '../../../util-components/IconButton';

interface PropTypes {
  order: OrderTypes
  setEditedOrder: (order: OrderTypes | null) => void
  index: number
}

function OrderItem({ order, setEditedOrder, index }: PropTypes) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(order.buyer.profileImage.uri);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const expandHeight = useExpandAnimation(isExpanded, 140, (order.products.length * 88 + 164), 180);

  function handleToggleExpand(){
    setIsExpanded(!isExpanded);
    setIsVisible(!isVisible)
  }
  function handleImagePreview(imageUri:string) {
    setPreviewImage(imageUri);
    showImageModal();
  }
  function handleOnEditPress(){
    setEditedOrder(order);
  }

  if(!order) return <></>;
  return (
    <Pressable onPress={handleToggleExpand}>
      <Animated.View style={[styles.container, { height: expandHeight }]}>
        <Text style={styles.timestamp}>{getFormattedDate(order.createdAt)}</Text>


        <View style={styles.infoContainer}>
          {previewImage && (
            <ImagePreviewModal
              image={previewImage}
              isVisible={isImageModalVisible}
              onCancel={hideImageModal}
            />
          )}
          <Pressable onPress={() => handleImagePreview(order.buyer.profileImage.uri)}>
            <Image source={order.buyer.profileImage} style={styles.profileImage}/>
          </Pressable>
          <View style={styles.info}>
            <Text>{order.buyer.name}</Text>
            <Text>{order.buyer.address}</Text>
            <Text>{order.buyer.phone}</Text>
            <Text>Cena: {order.totalPrice}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <IconButton
                size={26}
                color={Colors.secondaryDark}
                onPress={handleOnEditPress}
                key={`key-${order._id}-edit-button`}
                icon='edit'
                style={styles.editButtonContainer} 
                pressedStyles={styles.buttonContainerPressed}
              />
          </View>
        </View>
        
        {isVisible && (
          <Animated.View style={styles.productsContainer}>
            <Text style={styles.header}>Lista artikala:</Text>
            {order.products.map((product, index) => <DisplayOrderProduct key={`${index}-${product._id}`} product={product} index={index}/>)}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    elevation: 2,
    backgroundColor: Colors.white,
    minHeight: 140,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10
  },
  timestamp: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    color: Colors.secondaryDark
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    maxHeight: 110,
    minHeight: 110,
    alignItems: 'center'
  },
  profileImage: {
    height: 70,
    width: 140,
    flex: 2,
    borderRadius: 4,
  },
  info: {
    flex: 10,
  },
  buttonsContainer: {
    width: 60,
    height: '100%'
  },
  editButtonContainer : {
    position: 'absolute',
    right: 8,
    top: 8,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2
  },
  buttonContainerPressed: {
    opacity: 0.7,
    elevation: 1,
  },
  productsContainer: {
  },
  header: {
    fontWeight: 'bold',
  }
})

export default OrderItem