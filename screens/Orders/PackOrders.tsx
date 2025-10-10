import React, { useContext, useMemo, useState } from 'react';
import SafeView from '../../components/layout/SafeView';
import { filterPackOrders } from '../../components/orders/packOrders/packOrderFilterMethod';
import PackOrdersControlls from '../../components/orders/packOrders/PackOrdersControlls';
import PackOrdersItemsList from '../../components/orders/packOrders/PackOrdersItemsList';
import { OrdersContext } from '../../store/orders-context';
import { CategoryTypes } from '../../types/allTsTypes';

function PackOrders() {
  const [selectedCourier, setSelectedCourier] = useState<CategoryTypes | null>(null);
  const [searchParams, setSearchParams] = useState({
    query: '',
  });
  const orderCtx = useContext(OrdersContext);

  const filteredOrders = useMemo(() => {
    if (searchParams.query === '') {
      return orderCtx.unpackedOrders;
    } else {
      return filterPackOrders(orderCtx.unpackedOrders, searchParams);
    }
  }, [orderCtx.unpackedOrders, searchParams]);

  return (
    <SafeView>
      <PackOrdersControlls searchParams={searchParams} setSearchParams={setSearchParams} orders={filteredOrders} />
      <PackOrdersItemsList selectedCourier={selectedCourier} data={filteredOrders} />
    </SafeView>
  );
}

export default PackOrders;
