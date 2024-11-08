import React, { useState } from 'react'
import { Text } from 'react-native'
import PackOrdersItemsList from '../../components/orders/packOrders/PackOrdersItemsList'
import PackOrdersControlls from '../../components/orders/packOrders/PackOrdersControlls';
import { CategoryTypes } from '../../types/allTsTypes';

function PackOrders() {
  const [selectedCourier, setSelectedCourier] = useState<CategoryTypes | null>(null);

  return (
    <>
      <PackOrdersControlls
        selectedCourier={selectedCourier}
        setSelectedCourier={setSelectedCourier}
      />
      <PackOrdersItemsList
        selectedCourier={selectedCourier}
      />
    </>
  )
}

export default PackOrders