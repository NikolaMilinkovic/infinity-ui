import React, { useContext, useState } from 'react'
import { Colors } from '../../../constants/colors'
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native'
import { OrderTypes } from '../../../types/allTsTypes';
import IconButton from '../../../util-components/IconButton';
import DisplayOrderProduct from '../browseOrders/DisplayOrderProduct';
import { getFormattedDate } from '../../../util-methods/DateFormatters';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { fetchData } from '../../../util-methods/FetchMethods';
import { AuthContext } from '../../../store/auth-context';
import { popupMessage } from '../../../util-components/PopupMessage';
import { betterConsoleLog } from '../../../util-methods/LogMethods';
import sleep from '../../../util-methods/SleepMethod';
interface PackOrderItemPropTypes {
  order: OrderTypes
}
function PackOrderItem({ order }: PackOrderItemPropTypes) {
  const [isExpanded, setIsExpanded] = useState(!order.packedIndicator);
  const [isPacked, setIsPacked] = useState(order.packedIndicator || false);
  const expandHeight = useExpandAnimation(isExpanded, 160, (order.products.length * 88 + 184), 180);
  const styles = getStyles(isPacked);
  const authCtx = useContext(AuthContext)
  const token = authCtx.token;
  function handleOnPress(){
    setIsExpanded(() => !isExpanded);
  }

  async function handlePackOrder(){
    try{
      setIsPacked(true);
      setIsExpanded(false);
      await sleep(140);
      const response = await fetchData(token, `orders/packed/set-indicator-to-true/${order._id}`, 'POST');
      if(!response){
        popupMessage('Došlo je do problema prilikom ažuriranja pakovanja porudžbine', 'danger');
        setIsPacked(false);
        setIsExpanded(true);
      } else {
        popupMessage(response.message, 'success');
      }
    } catch(error) {
      console.error(error);
    }
  }
  async function handleUnpackOrder(){
    try{
      setIsPacked(false);
      setIsExpanded(true);
      await sleep(140);
      const response = await fetchData(token, `orders/packed/set-indicator-to-false/${order._id}`, 'POST');
      if(!response){
        popupMessage('Došlo je do problema prilikom ažuriranja pakovanja porudžbine', 'danger');
        setIsPacked(false);
        setIsExpanded(true);
      } else {
        popupMessage(response.message, 'success');
      }
    } catch(error) {
      console.error(error);
    }
  }
  
  if(!order) return <></>;
  return (
    <Pressable
      delayLongPress={100} 
      onPress={handleOnPress}
    >
      <Animated.View style={[styles.container, { height: expandHeight }]}>
        <Text style={styles.timestamp}>{getFormattedDate(order.createdAt)}</Text>


        <View style={styles.infoContainer}>
          <View style={styles.info}>

            {/* NAME */}
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Kupac:</Text>
              <Text style={styles.rowText}>{order.buyer.name}</Text>
            </View>

            {/* ADDRESS */}
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Adresa:</Text>
              <Text style={styles.rowText}>{order.buyer.address}, {order.buyer.place}</Text>
            </View>

            {/* PHONE */}
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Tel.</Text>
              <Text style={styles.rowText}>{order.buyer.phone}</Text>
            </View>

            {/* TOTAL PRICE */}
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Otkup:</Text>
              <Text style={styles.rowText}>{order.totalPrice} din.</Text>
            </View>

            {/* COURIER */}
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Kurir:</Text>
              <Text style={styles.rowText}>{order.courier?.name}</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonBorder}>
              {isPacked ? (
                <IconButton
                  size={36}
                  color={Colors.success}
                  onPress={handleUnpackOrder}
                  key={`key-${order._id}-edit-button`}
                  icon='check'
                  style={styles.buttonChecked} 
                  pressedStyles={styles.buttonContainerPressed}
                />
              ) : (
                <Pressable
                  onPress={handlePackOrder}
                  style={styles.packedButton}
                />
              )}
            </View>
          </View>
        </View>
        
        {isExpanded && (
          <Animated.View style={styles.productsContainer}>
            <Text style={styles.header}>Lista artikala:</Text>
            {order.products.map((product, index) => <DisplayOrderProduct key={`${index}-${product._id}`} product={product} index={index}/>)}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  )
}

function getStyles(isPacked: boolean){
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      elevation: 2,
      backgroundColor: isPacked ? Colors.white : Colors.secondaryHighlight,
      minHeight: 160,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
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
    },
    rowText: {
      flex: 4,
    },
    buttonsContainer: {
      width: 50,
      height: '100%'
    },
    buttonBorder: {
      height: 42,
      width: 42,
      elevation: 2,
      borderWidth: 2,
      borderColor: isPacked ? Colors.success : Colors.highlight,
      backgroundColor: isPacked ? Colors.white : Colors.secondaryHighlight,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderRadius: 4,
    },
    buttonChecked : {
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

export default PackOrderItem