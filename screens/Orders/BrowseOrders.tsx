import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OrdersContext } from '../../store/orders-context';
import OrderItemsList from '../../components/orders/browseOrders/OrderItemsList';
import SearchOrders from '../../components/orders/browseOrders/SearchOrders';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import { searchOrders } from '../../util-methods/OrderFilterMethods';
import Animated from 'react-native-reanimated';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';

interface SearchParamsTypes {
  processed: boolean
  unprocessed: boolean
  packed: boolean
  unpacked: boolean
  onCourierSearch: string
  ascending: boolean,
  descending: boolean,
}
function BrowseOrders() {
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedOrder, setEditedOrder] = useState(null);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [pickedDate, setPickedDate] = useState('');
  useBackClickHandler(!!editedOrder, removeEditedOrder);
  function removeEditedOrder(){
    setEditedOrder(null);
  }

  // UPDATE WHEN ADDING MORE SEARCH OPTIONS
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    processed: false,
    unprocessed: true,
    packed: false,
    unpacked: true,
    onCourierSearch: '',
    ascending: true,
    descending: false,
  });
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  const filteredData = useMemo(() => {
    if(isDatePicked) return searchOrders(searchData, ordersCtx.customOrderSet, searchParams);
    if(searchParams.processed) return searchOrders(searchData, ordersCtx.processedOrders, searchParams);
    if(searchParams.unprocessed) return searchOrders(searchData, ordersCtx.unprocessedOrders, searchParams);
    return [];
  }, [ordersCtx.customOrderSet, ordersCtx.processedOrders, ordersCtx.unprocessedOrders, searchData, searchParams]);

  const editOrderFade = useFadeTransition(editedOrder !== null);
  const overlayView = useFadeTransitionReversed(editedOrder === null, 500, 150);
  const [temp, setTemp] = useState(editedOrder?.buyer?.profileImage || '');
  

  return (
    <>
      {editedOrder === null ? (
        <View style={styles.ordersListContainer}>
          <Animated.View style={[overlayView, styles.overlayView]} />
          <SearchOrders 
            searchData={searchData} 
            setSearchData={setSearchData} 
            updateSearchParam={updateSearchParam} 
            isDatePicked={isDatePicked}
            setIsDatePicked={setIsDatePicked}
            setPickedDate={setPickedDate}
          />
          <OrderItemsList data={filteredData} setEditedOrder={setEditedOrder} isDatePicked={isDatePicked} pickedDate={pickedDate} />
        </View>
      ) : (
        <Animated.View style={editOrderFade}> 
          <EditOrder
            editedOrder={editedOrder}
            setEditedOrder={setEditedOrder}
          />
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
