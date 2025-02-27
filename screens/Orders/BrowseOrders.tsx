import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { OrdersContext } from '../../store/orders-context';
import OrderItemsList from '../../components/orders/browseOrders/OrderItemsList';
import SearchOrders from '../../components/orders/browseOrders/SearchOrders';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import { searchOrders } from '../../util-methods/OrderFilterMethods';
import Animated from 'react-native-reanimated';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import Button from '../../util-components/Button';

interface SearchParamsTypes {
  processed: boolean
  unprocessed: boolean
  packed: boolean
  unpacked: boolean
  packedAndUnpacked: boolean
  onCourierSearch: string
  ascending: boolean,
  descending: boolean,
}
function BrowseOrders() {
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedOrder, setEditedOrder] = useState(null);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [isDateForPeriodPicked, setIsDateForPeriodPicked] = useState(false);
  const [pickedDate, setPickedDate] = useState('');
  const [pickedDateForPeriod, setPickedDateForPeriod] = useState('');
  useBackClickHandler(!!editedOrder, removeEditedOrder);
  function removeEditedOrder(){
    console.log('> removeEditedOrder called')
    setEditedOrder(null);
  }

  // UPDATE WHEN ADDING MORE SEARCH OPTIONS
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    processed: false,
    unprocessed: true,
    packed: false,
    unpacked: true,
    packedAndUnpacked: true,
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
    if(isDateForPeriodPicked) return searchOrders(searchData, ordersCtx.customOrderSet, searchParams);
    if(searchParams.processed) return searchOrders(searchData, ordersCtx.processedOrders, searchParams);
    if(searchParams.unprocessed) return searchOrders(searchData, ordersCtx.unprocessedOrders, searchParams);
    return [];
  }, [ordersCtx.customOrderSet, ordersCtx.processedOrders, ordersCtx.unprocessedOrders, searchData, searchParams, isDatePicked]);

  const editOrderFade = useFadeTransition(editedOrder !== null);
  const overlayView = useFadeTransitionReversed(editedOrder === null, 500, 150);

  return (
    <>
      <View style={styles.ordersListContainer}>
        <Animated.View style={[overlayView, styles.overlayView]} />
        <SearchOrders 
          searchData={searchData} 
          setSearchData={setSearchData} 
          updateSearchParam={updateSearchParam} 
          isDatePicked={isDatePicked}
          setIsDatePicked={setIsDatePicked}
          setPickedDate={setPickedDate}
          isDateForPeriodPicked={isDateForPeriodPicked}
          setIsDateForPeriodPicked={setIsDateForPeriodPicked}
          setPickedDateForPeriod={setPickedDateForPeriod}
        />
        <OrderItemsList
          data={filteredData} 
          setEditedOrder={setEditedOrder} 
          isDatePicked={isDatePicked} 
          pickedDate={pickedDate} 
          pickedDateForPeriod={pickedDateForPeriod}
          isDateForPeriodPicked={isDateForPeriodPicked}
        />
      </View>
      <Modal
        animationType="slide"
        visible={editedOrder !== null}
        onRequestClose={removeEditedOrder}
        >
          <Animated.View style={editOrderFade}> 
            <EditOrder
              editedOrder={editedOrder}
              setEditedOrder={setEditedOrder}
            />
          </Animated.View>
      </Modal>
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
