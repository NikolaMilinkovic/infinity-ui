import React, { useContext, useEffect, useMemo, useState } from 'react'
import { OrdersContext } from '../../store/orders-context'
import useBackClickHandler from '../../hooks/useBackClickHandler'
import { searchReservations } from '../../util-methods/ReservationFilterMethods';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import SearchReservations from '../../components/reservations/SearchReservations';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import ReservationsItemsList from '../../components/reservations/ReservationsItemsList';
import { OrderTypes } from '../../types/allTsTypes';
import filterReservations from '../../components/reservations/filterReservations';
import { betterConsoleLog } from '../../util-methods/LogMethods';

interface SearchParamsTypes {
  ascending: boolean,
  descending: boolean,
}
function BrowseReservations() {
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedReservation, setEditedReservation] = useState<OrderTypes | null>(null);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [pickedDate, setPickedDate] = useState('');
  useBackClickHandler(!!editedReservation, removeEditedORder);
  function removeEditedORder(){
    setEditedReservation(null);
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
    // if(isDatePicked) return searchReservations(searchData, ordersCtx.customReservationsSet, searchParams);
    // return searchReservations(searchData, ordersCtx.unprocessedOrders, searchParams);
    const filteredRes = filterReservations(ordersCtx.unprocessedOrders);
    return filteredRes;
  }, [ordersCtx.customReservationsSet, ordersCtx.unprocessedOrders, searchData, searchParams, isDatePicked]);
  
  const overlayView = useFadeTransitionReversed(editedReservation === null, 500, 150);
  const editOrderFade = useFadeTransition(editedReservation !== null);
  return (
    <>
      {editedReservation === null ? (
        <View style={styles.reservationsContainer}>
          <Animated.View style={[overlayView, styles.overlayView]}/>
          {/* <SearchReservations
            searchData={searchData} 
            setSearchData={setSearchData} 
            updateSearchParam={updateSearchParam} 
            isDatePicked={isDatePicked}
            setIsDatePicked={setIsDatePicked}
            setPickedDate={setPickedDate}
          /> */}
          <ReservationsItemsList
            data={filteredData}
            setEditedReservation={setEditedReservation}
            isDatePicked={isDatePicked}
            pickedDate={pickedDate}
          />
        </View>
      ) : (
        <Animated.View style={editOrderFade}> 
          <EditOrder
            editedOrder={editedReservation}
            setEditedOrder={setEditedReservation}
          />
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  overlayView: {
    
  },
  reservationsContainer: {
    flex: 1,
    paddingBottom: 70,
  }
})

export default BrowseReservations