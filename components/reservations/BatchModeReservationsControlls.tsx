import React, { useContext, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import IconButton from '../../util-components/IconButton'
import { Colors } from '../../constants/colors'
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand'
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation'
import CourierSelector from '../../util-components/CourierSelector'
import { CourierTypes } from '../../types/allTsTypes'
import { betterConsoleLog } from '../../util-methods/LogMethods'
import { fetchWithBodyData } from '../../util-methods/FetchMethods'
import { AuthContext } from '../../store/auth-context'
import useAuthToken from '../../hooks/useAuthToken'
import { popupMessage } from '../../util-components/PopupMessage'


interface PropTypes {
  active: boolean
  onRemoveBatchPress: () => void
  selectedReservations: string[]
  resetBatchMode: () => void
}
function BatchModeReservationsControlls({ active, onRemoveBatchPress, selectedReservations, resetBatchMode }:PropTypes) {
  useEffect(() => {
    setIsExpanded(active);
  }, [active])
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 60, 100);
  const token = useAuthToken();

  
  const [selectedCourier, setSelectedCourier] = useState<CourierTypes | null>(null);
  async function saveReservationsAsOrders(){
    try{
      const data = {
        courier: {
          name: selectedCourier?.name,
          deliveryPrice: Number(selectedCourier?.deliveryPrice)
        },
        reservations: selectedReservations
      }
      resetBatchMode();
      const response = await fetchWithBodyData(token, 'orders/reservations-to-orders', data, 'POST');

      if(response?.status === 200){
        console.log('> response is 200 sending the success message')
        const data = await response?.json();
        popupMessage(response.message, 'success');
        return popupMessage(data.message, 'success');

      } else {
        console.log('> response is NOT 200 sending the danger message')
        const data = await response?.json();
        return popupMessage(data.message, 'danger');
      }
    } catch(error) {
      console.log(error);
      popupMessage('Došlo je do problema prilikom prebacivanja rezervacija u porudžbine', 'danger');
    }
  }

  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          <View style={styles.couriersContainer}>
            <CourierSelector
              style={styles.courierSelector}
              setSelectedCourier={setSelectedCourier}
            />
            <IconButton
              size={26}
              color={Colors.primaryDark}
              onPress={saveReservationsAsOrders}
              key={`key-remove-batch-button`}
              icon='check'
              style={styles.saveToCourrierButton} 
              pressedStyles={styles.removeBatchItemsButtonPressed}
            />
          </View>
          <IconButton
            size={22}
            color={Colors.highlight}
            onPress={onRemoveBatchPress}
            key={`key-remove-batch-button`}
            icon='delete'
            style={styles.removeBatchItemsButton} 
            pressedStyles={styles.removeBatchItemsButtonPressed}
          />
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    backgroundColor: Colors.primaryLight,
    flexDirection: 'row',
  },
  couriersContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  courierSelector: {
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    height: 40,
    flex: 1
  },
  saveToCourrierButton: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  removeBatchItemsButton: {
    margin: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  removeBatchItemsButtonPressed: {
    opacity: 0.7,
    elevation: 1,
  },
})

export default BatchModeReservationsControlls