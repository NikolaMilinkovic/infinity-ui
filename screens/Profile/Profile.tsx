import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { OrdersContext } from '../../store/orders-context'

function Profile() {
  const ordersCtx = useContext(OrdersContext);
  return (
    <View>
      <Text>
        Ovo je Profile stranica
      </Text>
      {ordersCtx.unprocessedOrders && ordersCtx.unprocessedOrders.map((order, index) => (
        <Text key={index}>{index} - {order.buyer.name}</Text>
      ))}
    </View>
  )
}

export default Profile