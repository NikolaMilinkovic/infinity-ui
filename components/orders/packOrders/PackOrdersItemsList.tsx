import React, { useContext, useEffect, useState } from 'react'
import { OrdersContext } from '../../../store/orders-context'
import { FlatList, Pressable, StyleSheet} from 'react-native';
import PackOrderItem from './PackOrderItem';
import { CourierTypes, OrderTypes } from '../../../types/allTsTypes';

interface PackOrderItemsListPropTypes {
  selectedCourier: CourierTypes | null
}
function PackOrdersItemsList({ selectedCourier }: PackOrderItemsListPropTypes) {
  const orderCtx = useContext(OrdersContext);
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  useEffect(() => {
    if(selectedCourier === null){
      setOrders(() => 
        orderCtx.unprocessedOrders.filter((order) => order.packed === false)
      )
    } else {
      setOrders(() => 
        orderCtx.unprocessedOrders.filter((order) => order.packed === false && order?.courier?.name === selectedCourier.name)
      )
    }
  }, [orderCtx.unprocessedOrders, selectedCourier]);

  return (
    <FlatList 
    data={orders} 
    keyExtractor={(item) => item._id} 
    renderItem={({item, index}) => 
      <Pressable
        delayLongPress={100}

      >
        <PackOrderItem 
          order={item} 
        />
      </Pressable>
    }
    style={styles.list}
    contentContainerStyle={styles.listContainer}
    initialNumToRender={10}
  />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    gap: 8,
  },
  list: {
    paddingTop: 8,
  },
})
export default PackOrdersItemsList