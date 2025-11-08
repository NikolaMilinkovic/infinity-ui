import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalStyles } from '../../../constants/globalStyles';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useHighlightAnimation } from '../../../hooks/useHighlightAnimation';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import { ImageTypes, OrderTypes } from '../../../types/allTsTypes';
import CustomText from '../../../util-components/CustomText';
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
  if (!order) return <></>;

  const colors = useThemeColors();
  const styles = getStyles(colors, order.packed);
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(order.buyer.profileImage);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useUser();
  const [noteHeight, setNoteHeight] = useState(0);
  useEffect(() => {
    if (!order.orderNotes) setNoteHeight(0);
  }, [order.orderNotes]);
  const onNoteLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setNoteHeight(height);
  };
  const expandedHeight = useMemo(() => {
    return order.products.length * 88 + 184 + noteHeight;
  }, [order.products.length, noteHeight]);
  const expandHeight = useExpandAnimation(isExpanded, 160, expandedHeight, 180);
  const globalStyles = useGlobalStyles();

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
    highlightColor: colors.selectedProductBackground,
  });

  function Row({ children }: any) {
    return <View style={{ flexDirection: 'row', gap: 6 }}>{children}</View>;
  }

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
            <CustomText variant="header" style={{ marginBottom: 0, fontSize: 15 }}>
              {order.buyer.name}
            </CustomText>
            <Text style={[{ color: colors.grayText, marginBottom: 8, marginTop: -4 }, styles.orderTextinfoSize]}>
              {order.buyer.address}, {order.buyer?.place}
            </Text>
            <Row>
              <CustomText variant="bold" style={[{ minWidth: 46 }, styles.orderTextinfoSize]}>
                Tel.
              </CustomText>
              <Text style={[{ color: colors.defaultText }, styles.orderTextinfoSize]}>{order.buyer.phone}</Text>
            </Row>
            <Row>
              <CustomText variant="bold" style={[{ minWidth: 46 }, styles.orderTextinfoSize]}>
                Otkup:
              </CustomText>
              <Text style={[{ color: colors.defaultText }, styles.orderTextinfoSize]}>{order.totalPrice} rsd.</Text>
            </Row>
            <Row>
              <CustomText variant="bold" style={[{ minWidth: 46 }, styles.orderTextinfoSize]}>
                Kurir:
              </CustomText>
              <Text style={[{ color: colors.defaultText }, styles.orderTextinfoSize]}>{order.courier?.name}</Text>
            </Row>
            {order.orderNotes && (
              <CustomText variant="bold" style={styles.orderNoteIndicator}>
                NAPOMENA
              </CustomText>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            {batchMode ? (
              <>
                {isHighlighted && (
                  <IconButton
                    size={26}
                    color={colors.defaultText}
                    onPress={() => onRemoveHighlight(order)}
                    key={`key-${order._id}-highlight-button`}
                    icon="check"
                    style={[styles.editButtonContainer, { backgroundColor: colors.selectedProductButtonBackground }]}
                    pressedStyles={styles.buttonContainerPressed}
                    backColor={'transparent'}
                    backColor1={'transparent'}
                  />
                )}
              </>
            ) : (
              <>
                {user?.permissions?.orders?.update && (
                  <IconButton
                    size={26}
                    color={colors.defaultText}
                    onPress={handleOnEditPress}
                    key={`key-${order._id}-edit-button`}
                    icon="edit"
                    style={[styles.editButtonContainer]}
                    pressedStyles={styles.buttonContainerPressed}
                    backColor={'transparent'}
                    backColor1={'transparent'}
                  />
                )}
              </>
            )}
            {order.packed && order.packedIndicator && (
              <CustomText style={styles.packedText} variant="bold">
                SPAKOVANO
              </CustomText>
            )}
          </View>
        </View>

        {isExpanded && (
          <Animated.View style={styles.productsContainer}>
            {order.orderNotes && (
              <View style={styles.orderNoteContainer} onLayout={onNoteLayout}>
                <CustomText style={styles.orderNoteLabel} variant="bold">
                  Napomena:
                </CustomText>
                <CustomText style={styles.orderNoteText}>{order.orderNotes}</CustomText>
              </View>
            )}
            <CustomText variant="bold">Lista artikala:</CustomText>
            {order.products.map((product, index) => (
              <DisplayOrderProduct key={`${index}-${product._id}`} product={product} index={index} />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors, packed: boolean) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      backgroundColor: colors.containerBackground,
      minHeight: 160,
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 10,
      overflow: 'hidden',
      elevation: 1,
    },
    orderTextinfoSize: {
      fontSize: 13,
    },
    orderNoteIndicator: {
      position: 'absolute',
      right: -50,
      bottom: packed ? 10 : 0,
      color: colors.error,
    },
    timestamp: {
      position: 'absolute',
      right: 10,
      fontSize: 12,
      color: colors.grayText,
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
      width: 120,
      flex: 2,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
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
      backgroundColor: colors.background,
      padding: 10,
    },
    buttonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    },
    productsContainer: {},
    itemHighlightedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.defaultText,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none',
    },
    packedText: {
      position: 'absolute',
      fontWeight: 'bold',
      color: colors.success1,
      bottom: 10,
      right: -8,
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
      color: colors.error,
      flexShrink: 1,
    },
  });
}

export default React.memo(OrderItem);
