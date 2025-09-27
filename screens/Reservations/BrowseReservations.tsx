import React, { useContext, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import filterReservations from '../../components/reservations/filterReservations';
import ReservationsItemsList from '../../components/reservations/ReservationsItemsList';
import SearchReservations from '../../components/reservations/SearchReservations';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import { OrdersContext } from '../../store/orders-context';
import { OrderTypes } from '../../types/allTsTypes';

interface SearchParamsTypes {
  query: string;
  ascending: boolean;
  descending: boolean;
  pickedDate: string;
  pickedDateFormatted: string;
  onColorsSearch: string[];
  onSizeSearch: string[];
}
function BrowseReservations() {
  const ordersCtx = useContext(OrdersContext);
  const [editedReservation, setEditedReservation] = useState<OrderTypes | null>(null);
  useBackClickHandler(!!editedReservation, removeEditedReservation);
  function removeEditedReservation() {
    setEditedReservation(null);
  }

  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    query: '',
    ascending: true,
    descending: false,
    pickedDate: '',
    pickedDateFormatted: '',
    onColorsSearch: [],
    onSizeSearch: [],
  });
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  }

  const filteredData = useMemo(() => {
    // if (isDatePicked) return searchReservations(searchData, ordersCtx.customReservationsSet, searchParams);
    // return searchReservations(searchData, ordersCtx.unprocessedOrders, searchParams);
    const filteredRes = filterReservations(ordersCtx.unprocessedOrders, searchParams);
    return filteredRes;
  }, [ordersCtx.customReservationsSet, ordersCtx.unprocessedOrders, searchParams]);

  const overlayView = useFadeTransitionReversed(editedReservation === null, 500, 150);
  const editOrderFade = useFadeTransition(editedReservation !== null);
  return (
    <>
      <View style={styles.reservationsContainer}>
        <Animated.View style={[overlayView, styles.overlayView]} />
        <SearchReservations
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          updateSearchParam={updateSearchParam}
        />
        <View style={{ minHeight: '100%', paddingBottom: 100 }}>
          <ReservationsItemsList
            data={filteredData}
            setEditedReservation={setEditedReservation}
            isDatePicked={searchParams.pickedDateFormatted ? true : false}
            pickedDate={searchParams.pickedDateFormatted}
          />
        </View>
      </View>
      <Modal animationType="slide" visible={editedReservation !== null} onRequestClose={removeEditedReservation}>
        <Animated.View style={editOrderFade}>
          <EditOrder editedOrder={editedReservation} setEditedOrder={setEditedReservation} />
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlayView: {},
  reservationsContainer: {
    flex: 1,
    paddingBottom: 70,
  },
});

export default BrowseReservations;
