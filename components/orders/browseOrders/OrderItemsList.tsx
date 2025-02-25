import React, { useContext, useEffect, useState } from 'react'
import { OrdersContext } from '../../../store/orders-context'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import OrderItem from './OrderItem';
import { OrderTypes } from '../../../types/allTsTypes';
import { betterConsoleLog } from '../../../util-methods/LogMethods';
import BatchModeOrderControlls from './BatchModeOrderControlls';
import useBatchSelectBackHandler from '../../../hooks/useBatchSelectBackHandler';
import { downloadAndShareFile, downloadAndShareFileViaLink, handleFetchingWithBodyData } from '../../../util-methods/FetchMethods';
import { AuthContext } from '../../../store/auth-context';
import { popupMessage } from '../../../util-components/PopupMessage';
import ConfirmationModal from '../../../util-components/ConfirmationModal';
import useConfirmationModal from '../../../hooks/useConfirmationMondal';
import { generateExcellForOrders } from '../../../util-methods/Excell';

interface RenderPropType {
  item: OrderTypes
}
interface PropTypes {
  data: OrderTypes[]
  setEditedOrder: (order: OrderTypes | null) => void
  isDatePicked: boolean
  pickedDate: string
}

function OrderItemsList({ data, setEditedOrder, isDatePicked, pickedDate }: PropTypes) {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<OrderTypes[]>([]);
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const authCtx = useContext(AuthContext);
  const styles = getStyles(batchMode);
  const token = authCtx.token;
  function resetBatch(){
    setBatchMode(false);
    setSelectedOrders([]);
  }
  useBatchSelectBackHandler(batchMode, resetBatch);
  const [longPressActivated, setLongPressActivated] = useState(false);

  function handleLongPress(order: OrderTypes){
    if(batchMode) return;
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
    if(selectedOrders.length === 0) setSelectedOrders([order]);
    setBatchMode(true);
  }
  // Press handler after select mode is initialized
  function handlePress(order: OrderTypes){
    if(!batchMode) return;
    if (longPressActivated) return;
    if(selectedOrders.length === 0) return;
    const isIdSelected = selectedOrders?.some((presentItem) => presentItem._id === order._id);
    if(isIdSelected){
      if(selectedOrders.length === 1) setBatchMode(false);
      if(selectedOrders.length !== data.length - 1) setIsAllSelected(false);
      setSelectedOrders(selectedOrders.filter((item) => item._id !== order._id));
    } else {
      setSelectedOrders((prev) => [...prev, order]);
      if(selectedOrders.length === (data.length - 1)){
        setIsAllSelected(true);
      }
    }
  }


  // Removes all selected orders
  async function removeBatchOrdersHandler(){
    showModal(async () => {
      if(!token) return;
      let removeData = [];
      for(const order of selectedOrders) removeData.push(order._id);
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
  function selectAllOrdarsHandler(){
    if(selectedOrders.length === data.length){
      setIsAllSelected(false);
      return resetBatch();
    }
    setSelectedOrders(data);
    setIsAllSelected(true);
  }

  const [isExcellModalVisible, setIsExcellModalVisible] = useState(false);
  const [excell, setExcell] = useState({fileName: '', fileData: ''});
  function exportExcellDocumentHandler(){
    let excell = generateExcellForOrders(selectedOrders);
    betterConsoleLog('> Logging excell: ', excell);
    setExcell(excell);
    setIsExcellModalVisible(true);
    console.log('> exportExcellDocumentHandler called');
  }
  async function shareExcell(){
    if(!excell) return;
    try {
      await downloadAndShareFile(excell.fileName, excell.fileData);
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  }
  function closeExcellModal(){
    setIsExcellModalVisible(false);
  }

  useEffect(() => {
    betterConsoleLog('> Logging selected orders: ', selectedOrders.length);
  }, [selectedOrders]);

  return (
    <View>
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
        onConfirmBtnText='Prosledi'
        onCancelBtnText='Odustani'
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
      <FlatList 
        data={data} 
        keyExtractor={(item) => item._id} 
        renderItem={({item, index}) => 
          <Pressable
            delayLongPress={100}

          >
            <OrderItem 
              order={item} 
              setEditedOrder={setEditedOrder} 
              highlightedItems={selectedOrders}
              batchMode={batchMode}
              onRemoveHighlight={handlePress}
              onPress={handlePress}
              onLongPress={handleLongPress}
            />
          </Pressable>
        }
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => {
            return isDatePicked ? (
              <Text style={styles.listHeader}>Ukupno Porudžbina za {pickedDate}: {data.length}</Text>
            ):(
              <Text style={styles.listHeader}>Ukupno Porudžbina: {data.length}</Text>
            )
          }
        }
        initialNumToRender={10}
      />
    </View>
  )
}

function getStyles(batchMode: boolean){
  return StyleSheet.create({
    list: {
    },
    listHeader: {
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
    },
    listContainer: {
      gap: 6,
      paddingBottom: batchMode ? 82 : 22,
      
    },
  })
}

export default OrderItemsList