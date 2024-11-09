import React, { useContext, useMemo, useState } from 'react'
import { OrdersContext } from '../../store/orders-context'
import useBackClickHandler from '../../hooks/useBackClickHandler'
import { searchReservations } from '../../util-methods/ReservationFilterMethods';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import SearchReservations from '../../components/reservations/SearchReservations';
import OrderItemsList from '../../components/orders/browseOrders/OrderItemsList';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';

interface SearchParamsTypes {
  ascending: boolean,
  descending: boolean,
}
function BrowseReservations() {
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedOrder, setEditedOrder] = useState(null);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [pickedDate, setPickedDate] = useState('');
  useBackClickHandler(!!editedOrder, removeEditedORder);
  function removeEditedORder(){
    setEditedOrder(null);
  }
  
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    ascending: true,
    descending: false,
  })
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  }
  const filteredData = useMemo(() => {
    if(isDatePicked) return searchReservations(searchData, ordersCtx.customReservationsSet, searchParams);
    return searchReservations(searchData, ordersCtx.unprocessedOrders, searchParams);
  }, [ordersCtx.unprocessedOrders, searchData, searchParams])
  
  const overlayView = useFadeTransitionReversed(editedOrder === null, 500, 150);
  const editOrderFade = useFadeTransition(editedOrder !== null);
  return (
    <>
      {editedOrder === null ? (
        <View>
          <Animated.View style={[overlayView, styles.overlayView]}/>

          {/* TODO */}
          <SearchReservations/>
          <OrderItemsList
            data={filteredData}
            setEditedOrder={setEditedOrder}
            isDatePicked={isDatePicked}
            pickedDate={pickedDate}
          />
        </View>
      ) : (
        <Animated.View style={editOrderFade}> 
          <EditOrder
            editedOrder={editedOrder}
            setEditedOrder={setEditedOrder}
          />
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  overlayView: {

  }
})

export default BrowseReservations