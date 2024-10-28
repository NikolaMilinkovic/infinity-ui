import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { OrdersContext } from '../../store/orders-context';
import OrderItemsList from '../../components/orders/browseOrders/OrderItemsList';
import SearchOrders from '../../components/orders/browseOrders/SearchOrders';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import SearchProducts from '../../components/products/SearchProducts';
import { searchOrders } from '../../util-methods/OrderFilterMethods';
import Button from '../../util-components/Button';
import Animated from 'react-native-reanimated';

interface SearchParamsTypes {
  processed: boolean
  unprocessed: boolean
  packed: boolean
  unpacked: boolean
}
function BrowseOrders() {
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedOrder, setEditedOrder] = useState(null);

  // UPDATE WHEN ADDING MORE SEARCH OPTIONS
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    processed: false,
    unprocessed: true,
    packed: false,
    unpacked: true,
  });
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  const filteredData = useMemo(() => {
    if(searchParams.processed) return searchOrders(searchData, ordersCtx.processedOrders, searchParams);
    if(searchParams.unprocessed) return searchOrders(searchData, ordersCtx.unprocessedOrders, searchParams);
  }, [ordersCtx.processedOrders, ordersCtx.unprocessedOrders, searchData, searchParams]);

  const editOrderFade = useFadeTransition(editedOrder !== null);
  const overlayView = useFadeTransitionReversed(editedOrder === null, 500, 150);

  return (
    <>
      {editedOrder === null ? (
        <View style={styles.ordersListContainer}>
          <Animated.View style={[overlayView, styles.overlayView]} />
          <SearchOrders searchData={searchData} setSearchData={setSearchData} />
          <OrderItemsList data={filteredData} setEditedOrder={setEditedOrder} />
        </View>
      ) : (
        <Animated.View style={editOrderFade}> 
          <Button
            onPress={() => setEditedOrder(null)}
          >BACK</Button>
          {/* EDIT ORDER COMPONENT */}
        </Animated.View>
        // style={[editProductFade]}
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlayView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'white',
    pointerEvents: 'none',
  },
  ordersListContainer: {
    flex: 1,
    paddingBottom: 70
  }
});

export default BrowseOrders;
