import { useCallback, useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import useBatchSelectBackHandler from '../../../hooks/useBatchSelectBackHandler';
import useConfirmationModal from '../../../hooks/useConfirmationMondal';
import { AuthContext } from '../../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { OrderTypes } from '../../../types/allTsTypes';
import ConfirmationModal from '../../../util-components/ConfirmationModal';
import CustomText from '../../../util-components/CustomText';
import { popupMessage } from '../../../util-components/PopupMessage';
import { generateExcellForOrders } from '../../../util-methods/Excell';
import { downloadAndShareFile, handleFetchingWithBodyData } from '../../../util-methods/FetchMethods';
import BatchModeOrderControlls from './BatchModeOrderControlls';
import OrderItem from './OrderItem';

interface PropTypes {
  data: OrderTypes[];
  setEditedOrder: (order: OrderTypes | null) => void;
  isDatePicked: boolean;
  pickedDate: string;
  isDateForPeriodPicked: boolean;
  pickedDateForPeriod: string;
}

function OrderItemsList({
  data,
  setEditedOrder,
  isDatePicked,
  pickedDate,
  isDateForPeriodPicked,
  pickedDateForPeriod,
}: PropTypes) {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<OrderTypes[]>([]);
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const authCtx = useContext(AuthContext);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const token = authCtx.token;

  function resetBatch() {
    setBatchMode(false);
    setSelectedOrders([]);
  }
  useBatchSelectBackHandler(batchMode, resetBatch);
  const [longPressActivated, setLongPressActivated] = useState(false);

  function handleLongPress(order: OrderTypes) {
    if (batchMode) return;
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
    if (selectedOrders.length === 0) setSelectedOrders([order]);
    setBatchMode(true);
  }
  // Press handler after select mode is initialized
  function handlePress(order: OrderTypes) {
    if (!batchMode) return;
    if (longPressActivated) return;
    if (selectedOrders.length === 0) return;
    const isIdSelected = selectedOrders?.some((presentItem) => presentItem._id === order._id);
    if (isIdSelected) {
      if (selectedOrders.length === 1) setBatchMode(false);
      if (selectedOrders.length !== data.length - 1) setIsAllSelected(false);
      setSelectedOrders(selectedOrders.filter((item) => item._id !== order._id));
    } else {
      setSelectedOrders((prev) => [...prev, order]);
      if (selectedOrders.length === data.length - 1) {
        setIsAllSelected(true);
      }
    }
  }

  // Removes all selected orders
  async function removeBatchOrdersHandler() {
    showModal(async () => {
      if (!token) return;
      let removeData = [];
      for (const order of selectedOrders) removeData.push(order._id);
      const response = await handleFetchingWithBodyData(removeData, token, 'orders/remove-orders-batch', 'DELETE');

      if (response && !response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      if (!response) {
        return popupMessage('Došlo je do problema prilikom brisanja porudžbina..', 'danger');
      }

      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'success');
      resetBatch();
    });
  }

  // Selects all currently displayed orders
  const [isAllSelected, setIsAllSelected] = useState(false);
  function selectAllOrdarsHandler() {
    if (selectedOrders.length === data.length) {
      setIsAllSelected(false);
      return resetBatch();
    }
    setSelectedOrders(data);
    setIsAllSelected(true);
  }

  const [isExcellModalVisible, setIsExcellModalVisible] = useState(false);
  const [excell, setExcell] = useState({ fileName: '', fileData: '' });
  function exportExcellDocumentHandler() {
    let excell = generateExcellForOrders(selectedOrders);
    setExcell(excell);
    setIsExcellModalVisible(true);
  }
  async function shareExcell() {
    if (!excell) return;
    try {
      await downloadAndShareFile(excell.fileName, excell.fileData);
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  }
  function closeExcellModal() {
    setIsExcellModalVisible(false);
  }

  function getTotalOrdersCount() {
    if (isDatePicked)
      return (
        <CustomText variant="bold" style={styles.listHeader}>
          Ukupno Porudžbina za {pickedDate}: {data.length}
        </CustomText>
      );
    if (isDateForPeriodPicked)
      return (
        <CustomText variant="bold" style={styles.listHeader}>
          Ukupno Porudžbina od {pickedDateForPeriod}: {data.length}
        </CustomText>
      );
    return (
      <CustomText variant="bold" style={styles.listHeader}>
        Ukupno Porudžbina: {data.length}
      </CustomText>
    );
  }

  const renderItem = useCallback(
    ({ item }: { item: OrderTypes }) => (
      <OrderItem
        order={item}
        setEditedOrder={setEditedOrder}
        highlightedItems={selectedOrders}
        batchMode={batchMode}
        onRemoveHighlight={handlePress}
        onPress={handlePress}
        onLongPress={handleLongPress}
      />
    ),
    [selectedOrders, batchMode, handlePress, handleLongPress, setEditedOrder, data]
  );

  return (
    <View style={styles.container}>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={hideModal}
        message="Da li sigurno želiš da obrišeš selektovane porudžbine?"
      />
      <ConfirmationModal
        isVisible={isExcellModalVisible}
        onConfirm={shareExcell}
        onCancel={closeExcellModal}
        message={`Datoteka uspešno napravljena\nProsledi excell?`}
        onConfirmBtnText="Prosledi"
        onCancelBtnText="Odustani"
      />
      {batchMode && (
        <BatchModeOrderControlls
          active={batchMode}
          onRemoveBatchPress={removeBatchOrdersHandler}
          onSelectAllOrders={selectAllOrdarsHandler}
          onExcellExportPress={exportExcellDocumentHandler}
          isAllSelected={isAllSelected}
        />
      )}
      {/* <SafeAreaView edges={['bottom']} style={{ flex: 1 }}> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => getTotalOrdersCount()}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={20}
        removeClippedSubviews={true}
      />
      {/* </SafeAreaView> */}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.containerBackground,
      flex: 1,
    },
    list: {},
    listHeader: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 6,
    },
    listContainer: {
      gap: 2,
      paddingBottom: 50,
    },
  });
}

export default OrderItemsList;
