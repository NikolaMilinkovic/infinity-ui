import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native'
import PackOrdersItemsList from '../../components/orders/packOrders/PackOrdersItemsList'
import PackOrdersControlls from '../../components/orders/packOrders/PackOrdersControlls';
import { CategoryTypes, OrderTypes } from '../../types/allTsTypes';
import { OrdersContext } from '../../store/orders-context';
import { betterConsoleLog } from '../../util-methods/LogMethods';

function PackOrders() {
  const [selectedCourier, setSelectedCourier] = useState<CategoryTypes | null>(null);
  const orderCtx = useContext(OrdersContext);
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  useEffect(() => {
    if(selectedCourier === null){
      setOrders(() => orderCtx.unpackedOrders);
    } else {
      const filteredUnpackedOrders = orderCtx.unpackedOrders.filter(
        (order) => order.packed === false && order?.courier?.name === selectedCourier.name && order.reservation === false
      );
      setOrders(() => [...filteredUnpackedOrders]);
    }
  }, [orderCtx.unpackedOrders, selectedCourier]);
  
  return (
    <>
      <PackOrdersControlls
        selectedCourier={selectedCourier}
        setSelectedCourier={setSelectedCourier}
        orders={orders}
      />
      <PackOrdersItemsList
        selectedCourier={selectedCourier}
        data={orders}
      />
    </>
  )
}

export default PackOrders