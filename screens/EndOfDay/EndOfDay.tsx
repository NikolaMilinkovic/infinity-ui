import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import Button from '../../util-components/Button'
import { OrdersContext } from '../../store/orders-context';
import { generateExcellForOrders } from '../../util-methods/Excell';

function EndOfDay() {
  const orders = useContext(OrdersContext);
  async function handleOnDayEnd(){
    const filteredOrders = orders.unprocessedOrders.filter((order) => order?.courier?.name === 'Bex');
    generateExcellForOrders(filteredOrders);
  }

  return (
    <View>
      <Text>This is the end of day page</Text>
      <Button 
        onPress={handleOnDayEnd}
      >
        Zavrsi dan test button
      </Button>
    </View>
  )
}

export default EndOfDay