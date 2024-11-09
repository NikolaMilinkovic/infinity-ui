import React, { useEffect, useState } from 'react'
import { Animated, Image, Pressable, Text, View } from 'react-native'
import { ImageTypes, OrderTypes } from '../../types/allTsTypes';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { getFormattedDate } from '../../util-methods/DateFormatters';
import ImagePreviewModal from '../../util-components/ImagePreviewModal';
import useImagePreviewModal from '../../hooks/useImagePreviewModal';
import { useExpandAnimation } from '../../hooks/useExpand';
import IconButton from '../../util-components/IconButton';
import DisplayOrderProduct from '../orders/browseOrders/DisplayOrderProduct';


interface SelectedOrdersTypes {
  _id: string
}
interface PropTypes {
  order: OrderTypes
  setEditedOrder: (order: OrderTypes | null) => void
  highlightedItems: SelectedOrdersTypes[]
  batchMode: boolean
  onRemoveHighlight: (orderId: string) => void
  onPress: (orderId: string) => void
  onLongPress: (orderId: string) => void
}

function ReservationItem({ order, setEditedOrder, highlightedItems, batchMode, onRemoveHighlight, onPress, onLongPress }: PropTypes) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(order.buyer.profileImage);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const expandHeight = useExpandAnimation(isExpanded, 160, (order.products.length * 88 + 184), 180);
  const styles = getStyles(isHighlighted);

  useEffect(() => {
    const highlighted = highlightedItems.some((highlightedItem) => order._id === highlightedItem._id);
    if(highlighted){
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlightedItems, order])

  function handleOnPress(orderId:string){
    onPress(orderId);
    if(batchMode) {

    } else {
      setIsExpanded(!isExpanded);
      setIsVisible(!isVisible);
    }
  }
  function handleImagePreview(image:ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }
  function handleOnEditPress(){
    setEditedOrder(order);
  }

  if(!order) return <></>;
  return (
    <Pressable 
      delayLongPress={100} 
      onPress={() => handleOnPress(order._id)}
      onLongPress={() => onLongPress(order._id)}
    >
      {isHighlighted && (
        <View style={styles.itemHighlightedOverlay}/>
      )}
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
          <Pressable onPress={() => handleImagePreview(order.buyer.profileImage)}>
            <Image source={order.buyer.profileImage} style={styles.profileImage}/>
          </Pressable>
          <View style={styles.info}>
            <Text>{order.buyer.name}</Text>
            <Text>{order.buyer.address}</Text>
            <Text>{order.buyer.phone}</Text>
            <Text>Otkup: {order.totalPrice} din.</Text>
            <Text>Kurir: {order.courier?.name}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            {batchMode ? (
              <>
                {isHighlighted && (
                  <IconButton
                    size={26}
                    color={Colors.secondaryDark}
                    onPress={() => onRemoveHighlight(order._id)}
                    key={`key-${order._id}-highlight-button`}
                    icon='check'
                    style={styles.editButtonContainer} 
                    pressedStyles={styles.buttonContainerPressed}
                  />
                )}
              </>
            ) : (
              <IconButton
                  size={26}
                  color={Colors.secondaryDark}
                  onPress={handleOnEditPress}
                  key={`key-${order._id}-edit-button`}
                  icon='edit'
                  style={styles.editButtonContainer} 
                  pressedStyles={styles.buttonContainerPressed}
                />
            )}
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

function getStyles(isHighlighted:boolean){
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      elevation: 2,
      backgroundColor: Colors.white,
      minHeight: 160,
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
      maxHeight: 130,
      minHeight: 130,
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
    },
    itemHighlightedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.primaryDark,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none'
    }
  })
}

export default ReservationItem