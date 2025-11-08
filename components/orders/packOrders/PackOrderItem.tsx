import React, { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useExpandAnimationFromExpandedState } from '../../../hooks/useExpand';
import { AuthContext } from '../../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import { OrderTypes } from '../../../types/allTsTypes';
import CustomText from '../../../util-components/CustomText';
import IconButton from '../../../util-components/IconButton';
import { popupMessage } from '../../../util-components/PopupMessage';
import { getFormattedDate } from '../../../util-methods/DateFormatters';
import { fetchData } from '../../../util-methods/FetchMethods';
import sleep from '../../../util-methods/SleepMethod';
import DisplayOrderProduct from '../browseOrders/DisplayOrderProduct';
interface PackOrderItemPropTypes {
  order: OrderTypes;
}
function PackOrderItem({ order }: PackOrderItemPropTypes) {
  const [isExpanded, setIsExpanded] = useState(!order.packedIndicator);
  const [isPacked, setIsPacked] = useState(order.packedIndicator || false);
  const [noteHeight, setNoteHeight] = useState(0);
  const onNoteLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setNoteHeight(height);
  };
  const expandHeight = useExpandAnimationFromExpandedState(
    isExpanded,
    160,
    order.products.length * 88 + 184 + noteHeight,
    180
  );
  const colors = useThemeColors();
  const styles = getStyles(colors, isPacked);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const user = useUser();
  function handleOnPress() {
    setIsExpanded(() => !isExpanded);
  }
  useEffect(() => {
    setIsPacked(order.packedIndicator);
  }, [order.packedIndicator]);

  async function handlePackOrder() {
    try {
      if (!user?.permissions?.packaging?.check) {
        return popupMessage('Nemate permisiju za pakovanje porudžbina', 'danger');
      }
      setIsPacked(true);
      setIsExpanded(false);
      await sleep(140);
      const response = await fetchData(token, `orders/packed/set-indicator-to-true/${order._id}`, 'POST');
      if (!response) {
        popupMessage('Došlo je do problema prilikom ažuriranja pakovanja porudžbine', 'danger');
        setIsPacked(false);
        setIsExpanded(true);
      } else {
        popupMessage(response.message, 'success');
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function handleUnpackOrder() {
    try {
      if (!user?.permissions?.packaging?.check) {
        return popupMessage('Nemate permisiju za pakovanje porudžbina', 'danger');
      }
      setIsPacked(false);
      setIsExpanded(true);
      await sleep(140);
      const response = await fetchData(token, `orders/packed/set-indicator-to-false/${order._id}`, 'POST');
      if (!response) {
        popupMessage('Došlo je do problema prilikom ažuriranja pakovanja porudžbine', 'danger');
        setIsPacked(false);
        setIsExpanded(true);
      } else {
        popupMessage(response.message, 'success');
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!order) return <></>;
  return (
    <Pressable delayLongPress={200} onPress={handleOnPress}>
      <Animated.View style={[styles.container, { height: expandHeight }]}>
        <Text style={styles.timestamp}>{getFormattedDate(order.createdAt)}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.info}>
            {/* NAME */}
            <View style={styles.rowInfo}>
              <CustomText variant="bold" style={styles.rowLabel}>
                Kupac:
              </CustomText>
              <CustomText style={styles.rowText}>{order.buyer.name}</CustomText>
            </View>

            {/* ADDRESS */}
            <View style={[styles.rowInfo, { minHeight: 10 }]}>
              <CustomText variant="bold" style={styles.rowLabel}>
                Adresa:
              </CustomText>
              <CustomText style={styles.rowText}>
                {order.buyer.address}, {order.buyer.place}
              </CustomText>
            </View>

            {/* PHONE */}
            <View style={styles.rowInfo}>
              <CustomText variant="bold" style={styles.rowLabel}>
                Tel.
              </CustomText>
              <CustomText style={styles.rowText}>{order.buyer.phone}</CustomText>
            </View>

            {/* TOTAL PRICE */}
            <View style={styles.rowInfo}>
              <CustomText variant="bold" style={styles.rowLabel}>
                Otkup:
              </CustomText>
              <CustomText style={styles.rowText}>{order.totalPrice} rsd.</CustomText>
            </View>

            {/* COURIER */}
            <View style={styles.rowInfo}>
              <CustomText variant="bold" style={styles.rowLabel}>
                Kurir:
              </CustomText>
              <CustomText style={styles.rowText}>{order.courier?.name}</CustomText>
            </View>

            {/* ORDER NOTE INDICATOR */}
            {order.orderNotes && (
              <CustomText variant="bold" style={styles.orderNoteIndicator}>
                NAPOMENA
              </CustomText>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonBorder}>
              {isPacked ? (
                <IconButton
                  size={36}
                  color={colors.success1}
                  onPress={handleUnpackOrder}
                  key={`key-${order._id}-edit-button`}
                  icon="check"
                  style={styles.buttonChecked}
                  pressedStyles={styles.buttonContainerPressed}
                  backColor="transparent"
                  backColor1="transparent"
                />
              ) : (
                <Pressable onPress={handlePackOrder} style={styles.packedButton} />
              )}
            </View>
          </View>
        </View>

        {isExpanded && (
          <Animated.View style={styles.productsContainer}>
            {order.orderNotes && (
              <View style={styles.orderNoteContainer} onLayout={onNoteLayout}>
                <CustomText variant="bold" style={styles.orderNoteLabel}>
                  Napomena:
                </CustomText>
                <CustomText style={styles.orderNoteText} variant="bold">
                  {order.orderNotes}
                </CustomText>
              </View>
            )}
            <CustomText variant="bold">Lista artikala:</CustomText>
            {order.products.map((product, index) => (
              <DisplayOrderProduct key={`${index}-${product._id}`} product={product} index={index} grayedText={true} />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors, isPacked: boolean) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      backgroundColor: isPacked ? colors.background : colors.unpackedOrderBackground,
      minHeight: 160,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
      elevation: 1,
      overflow: 'hidden',
    },
    orderNoteIndicator: {
      position: 'absolute',
      right: -60,
      bottom: 0,
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
    info: {
      flex: 10,
    },
    rowInfo: {
      width: '100%',
      flex: 1,
      flexDirection: 'row',
    },
    rowLabel: {
      flex: 1.2,
      color: colors.grayText,
    },
    rowText: {
      flex: 4,
    },
    buttonsContainer: {
      width: 50,
      height: '100%',
    },
    buttonBorder: {
      height: 42,
      width: 42,
      borderWidth: 2,
      borderColor: isPacked ? colors.success1 : colors.error,
      backgroundColor: isPacked ? colors.background : colors.unpackedOrderBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderRadius: 4,
    },
    buttonChecked: {
      position: 'absolute',
      overflow: 'hidden',
    },
    packedButton: {
      height: 42,
      width: 42,
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
      backgroundColor: colors.background,
      zIndex: 12,
      opacity: 0.4,
      pointerEvents: 'none',
    },
    orderNoteContainer: {
      flexDirection: 'row',
      // height: 40,
      gap: 10,
    },
    orderNoteLabel: {
      minWidth: 75,
      flex: 4,
    },
    orderNoteText: {
      color: colors.error,
      flexShrink: 1,
    },
  });
}

export default React.memo(PackOrderItem, (prev, next) => prev.order === next.order);
