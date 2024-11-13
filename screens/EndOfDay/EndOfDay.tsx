import React, { useContext, useState } from 'react'
import { Text, View } from 'react-native'
import Button from '../../util-components/Button'
import { OrdersContext } from '../../store/orders-context';
import { generateExcellForOrders } from '../../util-methods/Excell';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import CourierSelector from '../../util-components/CourierSelector';
import { CourierTypes } from '../../types/allTsTypes';

function EndOfDay() {
  const orders = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const [selectedCourier, setSelectedCourier] = useState<CourierTypes>();
  const token = authCtx.token;
  async function handleOnDayEnd(){
    try{
      const filteredOrders = orders.unprocessedOrders.filter((order) => order?.courier?.name === selectedCourier?.name);
      const excellFile = generateExcellForOrders(filteredOrders);
      if(!excellFile) return popupMessage('Problem prilikom generisanja excell fajla', 'danger');
      const data = {
        courier: selectedCourier?.name,
        fileData: excellFile?.fileData,
        fileName: excellFile?.filename
      }
      const response = await fetchWithBodyData(token, 'orders/parse-orders-for-latest-period', data, 'POST');

      if(response?.status === 200){
        const data = await response?.json();
        return popupMessage(data.message, 'success');
      } else {
        const data = await response?.json();
      }
    } catch (error){
      popupMessage('Došlo je do problema prilikom izvlačenja informacija o porudžbinama za kurira', 'danger')
      return betterConsoleLog('> ERROR: ', error);
    }
  }

  return (
    <View>
      <CourierSelector
        setSelectedCourier={setSelectedCourier}
      />
      <Button 
        onPress={handleOnDayEnd}
      >
        Zavrsi dan test button
      </Button>
    </View>
  )
}

export default EndOfDay