import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useHighlightAnimation } from '../../../hooks/useHighlightAnimation';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import { useUser } from '../../../store/user-context';
import { ImageTypes, OrderTypes } from '../../../types/allTsTypes';
import IconButton from '../../../util-components/IconButton';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';
import { getFormattedDate } from '../../../util-methods/DateFormatters';
import DisplayOrderProduct from './DisplayOrderProduct';

interface SelectedOrdersTypes {
  _id: string;
}
interface PropTypes {
  order: OrderTypes;
  setEditedOrder: (order: OrderTypes | null) => void;
  highlightedItems: SelectedOrdersTypes[];
  batchMode: boolean;
  onRemoveHighlight: (order: OrderTypes) => void;
  onPress: (order: OrderTypes) => void;
  onLongPress: (order: OrderTypes) => void;
}

function OrderItem({
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
  const user = useUser();

  const noteHeight = useMemo(() => {
    if (!order.orderNotes) return 0;
    const baseHeight = 40;
    const charsPerLine = 40;
    const extraHeightPerLine = 20;
    const lines = Math.ceil(order.orderNotes.length / charsPerLine);
    return baseHeight + (lines - 1) * extraHeightPerLine;
  }, [order.orderNotes]);
  const expandedHeight = useMemo(() => {
    return order.products.length * 88 + 184 + noteHeight;
  }, [order.products.length, noteHeight]);
  const expandHeight = useExpandAnimation(isExpanded, 160, expandedHeight, 180);
  const styles = getStyles(isHighlighted, order.packed);

  useEffect(() => {
    const highlighted = highlightedItems.some((highlightedItem) => order._id === highlightedItem._id);
    if (highlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlightedItems, order]);

  function handleOnPress(order: OrderTypes) {
    onPress(order);
    if (batchMode) {
    } else {
      setIsExpanded(!isExpanded);
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
    <Pressable delayLongPress={200} onPress={() => handleOnPress(order)} onLongPress={() => onLongPress(order)}>
      {/* {isHighlighted && (
        <View style={styles.itemHighlightedOverlay}/>
      )} */}
      <Animated.View style={[styles.container, { height: expandHeight, backgroundColor }]}>
        <Text style={styles.timestamp}>{getFormattedDate(order.createdAt)}</Text>
        <View style={styles.infoContainer}>
          {previewImage && (
            <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
          )}
          <Pressable onPress={() => handleImagePreview(order.buyer.profileImage as any)}>
            <Image source={order.buyer.profileImage} style={styles.profileImage} />
          </Pressable>
          <View style={styles.info}>
            <Text style={{ fontWeight: 'bold' }}>{order.buyer.name}</Text>
            <Text>
              {order.buyer.address}, {order.buyer?.place}
            </Text>
            <Text>{order.buyer.phone}</Text>
            <Text>Otkup: {order.totalPrice} din.</Text>
            <Text>Kurir: {order.courier?.name}</Text>
            {order.orderNotes && <Text style={styles.orderNoteIndicator}>NAPOMENA</Text>}
          </View>
          <View style={styles.buttonsContainer}>
            {batchMode ? (
              <>
                {isHighlighted && (
                  <IconButton
                    size={26}
                    color={Colors.secondaryDark}
                    onPress={() => onRemoveHighlight(order)}
                    key={`key-${order._id}-highlight-button`}
                    icon="check"
                    style={[styles.editButtonContainer, { backgroundColor: '#9FB7C6' }]}
                    pressedStyles={styles.buttonContainerPressed}
                  />
                )}
              </>
            ) : (
              <>
                {user?.permissions?.orders?.update && (
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
              </>
            )}
            {order.packed && order.packedIndicator && <Text style={styles.packedText}>SPAKOVANO</Text>}
          </View>
        </View>

        {isExpanded && (
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
    itemHighlightedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.primaryDark,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none',
    },
    packedText: {
      position: 'absolute',
      color: Colors.success,
      bottom: 10,
      right: -10,
      width: 100,
    },
    orderNoteContainer: {
      flexDirection: 'row',
      minHeight: 40,
      gap: 10,
    },
    orderNoteLabel: {
      fontWeight: 'bold',
      minWidth: 85,
      flex: 4,
    },
    orderNoteText: {
      fontWeight: 'bold',
      color: Colors.error,
      flexShrink: 1,
    },
  });
}

export default OrderItem;
