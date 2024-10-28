import React, { useContext, useState } from 'react'
import { OrdersContext } from '../../../store/orders-context'
import { FlatList, StyleSheet, Text, View } from 'react-native';
import OrderItem from './OrderItem';
import { OrderTypes } from '../../../types/allTsTypes';

interface RenderPropType {
  item: OrderTypes
}
interface PropTypes {
  data: OrderTypes[]
  setEditedOrder: (order: OrderTypes | null) => void
}
function OrderItemsList({ data, setEditedOrder }: PropTypes) {
  const ordersCtx = useContext(OrdersContext);


  return (
    <View>
      <FlatList 
        data={data} 
        keyExtractor={(item) => item._id} 
        renderItem={(item:RenderPropType, index:number) => 
          <OrderItem order={item.item} setEditedOrder={setEditedOrder} index={index}/>
        }
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => 
          <Text style={styles.listHeader}>Ukupno Porudžbina: {data.length}</Text>
        }
        initialNumToRender={10}
        removeClippedSubviews={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  },
  listContainer: {
    gap: 6,
    paddingBottom: 16
  },
})

export default OrderItemsList