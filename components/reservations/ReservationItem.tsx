import React, { useEffect, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useExpandAnimation } from '../../hooks/useExpand';
import { useHighlightAnimation } from '../../hooks/useHighlightAnimation';
import useImagePreviewModal from '../../hooks/useImagePreviewModal';
import { ImageTypes, OrderTypes } from '../../types/allTsTypes';
import IconButton from '../../util-components/IconButton';
import ImagePreviewModal from '../../util-components/ImagePreviewModal';
import { getFormattedDate, getFormattedDateWithoutTime } from '../../util-methods/DateFormatters';
import DisplayOrderProduct from '../orders/browseOrders/DisplayOrderProduct';

interface SelectedOrdersTypes {
  _id: string;
}
interface PropTypes {
  order: OrderTypes;
  setEditedOrder: (order: OrderTypes | null) => void;
  highlightedItems: SelectedOrdersTypes[];
  batchMode: boolean;
  onRemoveHighlight: (orderId: string) => void;
  onPress: (orderId: string) => void;
  onLongPress: (orderId: string) => void;
}

function ReservationItem({
  order,
  setEditedOrder,
  highlightedItems,
  batchMode,
  onRemoveHighlight,
  onPress,
  onLongPress,
}: PropTypes) {
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(order.buyer.profileImage);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [noteHeight] = useState(order.orderNotes ? 40 : 0);
  const expandHeight = useExpandAnimation(isExpanded, 160, order.products.length * 88 + 184 + noteHeight, 180);
  const styles = getStyles(isHighlighted, order.packed);

  useEffect(() => {
    const highlighted = highlightedItems.some((highlightedItem) => order._id === highlightedItem._id);
    if (highlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlightedItems, order]);

  function handleOnPress(orderId: string) {
    onPress(orderId);
    if (batchMode) {
    } else {
      setIsExpanded(!isExpanded);
      setIsVisible(!isVisible);
    }
  }
  function handleImagePreview(image: ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }
  function handleOnEditPress() {
    setEditedOrder(order);
  }

  const backgroundColor = useHighlightAnimation({
    isHighlighted,
    duration: 120,
    highlightColor: '#A3B9CC',
  });

  if (!order) return <></>;
  return (
    <Pressable delayLongPress={200} onPress={() => handleOnPress(order._id)} onLongPress={() => onLongPress(order._id)}>
      <Animated.View style={[styles.container, { height: expandHeight, backgroundColor: backgroundColor }]}>
        <Text style={styles.timestamp}>{getFormattedDate(order.createdAt)}</Text>

        <View style={styles.infoContainer}>
          {previewImage && (
            <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
          )}
          <Pressable onPress={() => handleImagePreview(order.buyer.profileImage)}>
            <Image source={order.buyer.profileImage} style={styles.profileImage} />
          </Pressable>
          <View style={styles.info}>
            <Text>{order.buyer.name}</Text>
            <Text>
              {order.buyer.address}, {order.buyer.place}
            </Text>
            <Text>{order.buyer.phone}</Text>
            {order.reservation && order.reservationDate && (
              <>
                <Text style={{ fontWeight: 'bold' }}>Rezervisano za:</Text>
                <Text style={{ fontWeight: 'bold' }}>{getFormattedDateWithoutTime(order.reservationDate)}</Text>
              </>
            )}
            {order.orderNotes && <Text style={styles.orderNoteIndicator}>NAPOMENA</Text>}
            {/* <Text>Otkup: {order.totalPrice} din.</Text> */}
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
                    icon="check"
                    style={[styles.editButtonContainer, { backgroundColor: '#9FB7C6' }]}
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
                icon="edit"
                style={styles.editButtonContainer}
                pressedStyles={styles.buttonContainerPressed}
              />
            )}
            {order.packed && order.packedIndicator && <Text style={styles.packedText}>SPAKOVANO</Text>}
          </View>
        </View>

        {isVisible && (
          <Animated.View style={styles.productsContainer}>
            {order.orderNotes && (
              <View style={styles.orderNoteContainer}>
                <Text style={styles.orderNoteLabel}>Napomena:</Text>
                <Text style={styles.orderNoteText}>{order.orderNotes}</Text>
              </View>
            )}
            <Text style={styles.header}>Lista artikala:</Text>
            {order.products.map((product, index) => (
              <DisplayOrderProduct key={`${index}-${product._id}`} product={product} index={index} />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function getStyles(isHighlighted: boolean, packed: boolean) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      elevation: 2,
      backgroundColor: Colors.white,
      minHeight: 160,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
      overflow: 'hidden',
    },
    orderNoteIndicator: {
      position: 'absolute',
      right: -50,
      bottom: packed ? 10 : 0,
      color: Colors.error,
      fontWeight: 'bold',
    },
    timestamp: {
      position: 'absolute',
      right: 10,
      fontSize: 12,
      color: Colors.secondaryDark,
    },
    infoContainer: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
      maxHeight: 130,
      minHeight: 130,
      alignItems: 'center',
    },
    profileImage: {
      height: 70,
      width: 130,
      flex: 2,
      borderRadius: 4,
    },
    info: {
      flex: 10,
      position: 'relative',
      // Buttons su position absolute, ovo je njihova sirina kada se oduzme right: -12
      marginRight: 48,
    },
    buttonsContainer: {
      width: 60,
      height: '100%',
      position: 'absolute',
      right: -12,
    },
    editButtonContainer: {
      position: 'absolute',
      right: 8,
      top: 8,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: Colors.white,
      padding: 10,
      elevation: 2,
    },
    buttonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    },
    productsContainer: {},
    header: {
      fontWeight: 'bold',
    },
    orderNoteContainer: {
      flexDirection: 'row',
      height: 40,
      gap: 10,
    },
    orderNoteLabel: {
      fontWeight: 'bold',
      minWidth: 25,
      flex: 4,
    },
    orderNoteText: {
      fontWeight: 'bold',
      color: Colors.error,
    },
    packedText: {
      position: 'absolute',
      color: Colors.success,
      bottom: 10,
      right: -10,
      width: 100,
    },
  });
}

export default ReservationItem;
