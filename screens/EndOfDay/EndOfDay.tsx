import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Animated as RNAnimated } from 'react-native'
import Button from '../../util-components/Button'
import { OrdersContext } from '../../store/orders-context';
import { generateExcellForOrders } from '../../util-methods/Excell';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import CourierSelector from '../../util-components/CourierSelector';
import { CourierTypes } from '../../types/allTsTypes';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import { Colors } from '../../constants/colors';
import { useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import EndOfDayStatistics from '../../components/statistics/EndOfDayStatistics';

function EndOfDay() {
  const orders = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const [selectedCourier, setSelectedCourier] = useState<CourierTypes>();
  const token = authCtx.token;
  const fade = useFadeAnimation();

  async function handleOnDayEnd(){
    try{
      if(selectedCourier){
        const filteredOrders = orders.unprocessedOrders.filter((order) => order?.courier?.name === selectedCourier?.name && order.reservation === false);
        if(filteredOrders.length === 0) return popupMessage('Nemate preostalih porudžbina za ovog kurira', 'info');
        const excellFile = generateExcellForOrders(filteredOrders, selectedCourier.name);
        if(!excellFile) return popupMessage('Problem prilikom generisanja excell fajla', 'danger');
        const data = {
          courier: selectedCourier?.name,
          fileData: excellFile?.fileData,
          fileName: excellFile?.fileName
        }
        const response = await fetchWithBodyData(token, 'orders/parse-orders-for-latest-period', data, 'POST');
  
        if(response?.status === 200){
          const data = await response?.json();
          return popupMessage(data.message, 'success');
        } else {
          const data = await response?.json();
        }
      }
    } catch (error){
      popupMessage('Došlo je do problema prilikom izvlačenja informacija o porudžbinama za kurira', 'danger')
      return betterConsoleLog('> ERROR: ', error);
    }
  }
  const overlayView = useFadeTransitionReversed(orders.processedOrdersStats !== null, 500, 150);

  return (
    <RNAnimated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.controllsContainer}>
        <CourierSelector
          setSelectedCourier={setSelectedCourier}
          defaultValueByMatch='Bex'
        />
        <Button 
          onPress={handleOnDayEnd}
          backColor={Colors.highlight}
          textColor={Colors.white}
        >
          Završi dan i izvuci porudžbine
        </Button>
      </View>
      <ScrollView style={styles.statisticsContainer}>
        {/* <Animated.View style={[overlayView, styles.overlay]}/> */}
        {orders.processedOrdersStats === null ? (
          null
        ) : (
          <EndOfDayStatistics
            stats={orders.processedOrdersStats}
          />
        )}  
      </ScrollView>
    </RNAnimated.View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controllsContainer: {
    gap: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    padding: 16,
  },
  statisticsContainer: {
    position: 'relative',
    flex: 1
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    zIndex: 1,
  },
  temp: {
    // height: 40,
  }
})

export default EndOfDay