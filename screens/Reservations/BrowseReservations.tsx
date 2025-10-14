import { useContext, useMemo, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import filterReservations from '../../components/reservations/filterReservations';
import ReservationsItemsList from '../../components/reservations/ReservationsItemsList';
import SearchReservations from '../../components/reservations/SearchReservations';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../hooks/useFadeTransition';
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

  const editReservationFade = useFadeTransition(editedReservation !== null);

  return (
    <>
      <Animated.View style={styles.reservationsContainer}>
        <SearchReservations
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          updateSearchParam={updateSearchParam}
        />
        <ReservationsItemsList
          data={filteredData}
          setEditedReservation={setEditedReservation}
          isDatePicked={searchParams.pickedDateFormatted ? true : false}
          pickedDate={searchParams.pickedDateFormatted}
        />
      </Animated.View>

      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        visible={editedReservation !== null}
        onRequestClose={removeEditedReservation}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View style={[editReservationFade, { flex: 1 }]}>
            <EditOrder editedOrder={editedReservation} setEditedOrder={setEditedReservation} />
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  reservationsContainer: {
    flex: 1,
  },
});

export default BrowseReservations;
