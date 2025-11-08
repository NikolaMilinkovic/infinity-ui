import { StatusBar } from 'expo-status-bar';
import { useContext, useMemo, useState } from 'react';
import { Animated, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditOrder from '../../components/orders/browseOrders/editOrder/EditOrder';
import OrderItemsList from '../../components/orders/browseOrders/OrderItemsList';
import SearchOrders from '../../components/orders/browseOrders/SearchOrders';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useFadeTransition } from '../../hooks/useFadeTransition';
import { OrdersContext } from '../../store/orders-context';
import { useThemeColors } from '../../store/theme-context';
import KeyboardAvoidingWrapper from '../../util-components/KeyboardAvoidingWrapper';
import { searchOrders } from '../../util-methods/OrderFilterMethods';

interface SearchParamsTypes {
  processed: boolean;
  unprocessed: boolean;
  packed: boolean;
  unpacked: boolean;
  packedAndUnpacked: boolean;
  onCourierSearch: string;
  ascending: boolean;
  descending: boolean;
  onColorsSearch: string[];
  onSizeSearch: string[];
}
function BrowseOrders() {
  const colors = useThemeColors();
  const ordersCtx = useContext(OrdersContext);
  const [searchData, setSearchData] = useState('');
  const [editedOrder, setEditedOrder] = useState(null);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const [isDateForPeriodPicked, setIsDateForPeriodPicked] = useState(false);
  const [pickedDate, setPickedDate] = useState('');
  const [pickedDateForPeriod, setPickedDateForPeriod] = useState('');
  useBackClickHandler(!!editedOrder, removeEditedOrder);
  function removeEditedOrder() {
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
    onColorsSearch: [],
    onSizeSearch: [],
  });
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  const filteredData = useMemo(() => {
    if (isDatePicked) return searchOrders(searchData, ordersCtx.customOrderSet, searchParams);
    if (isDateForPeriodPicked) return searchOrders(searchData, ordersCtx.customOrderSet, searchParams);
    if (searchParams.processed) return searchOrders(searchData, ordersCtx.processedOrders, searchParams);
    if (searchParams.unprocessed) return searchOrders(searchData, ordersCtx.unprocessedOrders, searchParams);
    return [];
  }, [
    ordersCtx.customOrderSet,
    ordersCtx.processedOrders,
    ordersCtx.unprocessedOrders,
    searchData,
    searchParams,
    isDatePicked,
  ]);

  const editOrderFade = useFadeTransition(editedOrder !== null);

  return (
    <>
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

      <Modal
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
        animationType="fade"
        visible={editedOrder !== null}
        onRequestClose={removeEditedOrder}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryDark }}>
          <StatusBar style="light" translucent={true} />
          <Animated.View style={[editOrderFade, { flex: 1 }]} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingWrapper>
              {editedOrder && <EditOrder editedOrder={editedOrder} setEditedOrder={setEditedOrder} />}
            </KeyboardAvoidingWrapper>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default BrowseOrders;
