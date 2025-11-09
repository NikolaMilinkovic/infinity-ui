import { StatusBar } from 'expo-status-bar';
import { useContext, useMemo, useState } from 'react';
import { Modal, Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import filterReservations from '../../components/reservations/filterReservations';
import ReservationsItemsList from '../../components/reservations/ReservationsItemsList';
import SearchReservations from '../../components/reservations/SearchReservations';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../hooks/useFadeTransition';
import { OrdersContext } from '../../store/orders-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { OrderTypes } from '../../types/allTsTypes';
import KeyboardAvoidingWrapper from '../../util-components/KeyboardAvoidingWrapper';

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
  const colors = useThemeColors();
  const styles = getStyles(colors);
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
    const reservations = ordersCtx.orders.filter((o) => o.reservation);
    return filterReservations(reservations, searchParams);
  }, [ordersCtx.orders, searchParams]);

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
        visible={editedReservation !== null}
        onRequestClose={removeEditedReservation}
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryDark }}>
          <StatusBar style="light" translucent={true} />
          <Animated.View style={[editReservationFade, { flex: 1 }]}>
            <KeyboardAvoidingWrapper>
              <EditOrder editedOrder={editedReservation} setEditedOrder={setEditedReservation} />
            </KeyboardAvoidingWrapper>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    reservationsContainer: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
  });
}

export default BrowseReservations;
