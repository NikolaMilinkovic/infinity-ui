import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { OrderTypes } from '../../types/allTsTypes';
import useBatchSelectBackHandler from '../../hooks/useBatchSelectBackHandler';
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import ConfirmationModal from '../../util-components/ConfirmationModal';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import ReservationItem from './ReservationItem';
import BatchModeReservationsControlls from './BatchModeReservationsControlls';

interface RenderPropType {
  item: OrderTypes
}
interface PropTypes {
  data: OrderTypes[]
  setEditedReservation: (order: OrderTypes | null) => void
  isDatePicked: boolean
  pickedDate: string
}
interface SelectedOrdersTypes {
  _id: string
}
function ReservationsItemsList({ data, setEditedReservation, isDatePicked, pickedDate }: PropTypes) {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState<SelectedOrdersTypes[]>([]);
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const authCtx = useContext(AuthContext);
  const styles = getStyles(batchMode);
  const token = authCtx.token;
  function resetBatch(){
    setBatchMode(false);
    setSelectedReservations([]);
  }
  useBatchSelectBackHandler(batchMode, resetBatch);

  const [longPressActivated, setLongPressActivated] = useState(false);
  function handleLongPress(orderId: string){
    if(batchMode) return;
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
    if(selectedReservations.length === 0) setSelectedReservations([{_id: orderId}])
    setBatchMode(true);
  }
  // Press handler after select mode is initialized
  function handlePress(orderId: string){
    if(!batchMode) return;
    if (longPressActivated) return;
    if(selectedReservations.length === 0) return;
    const isIdSelected = selectedReservations?.some((presentItem) => presentItem._id === orderId)
    if(isIdSelected){
      if(selectedReservations.length === 1) setBatchMode(false);
      setSelectedReservations(selectedReservations.filter((order) => order._id !== orderId));
    } else {
      setSelectedReservations((prev) => [...prev, {_id: orderId}]);
    }
  }

  // TO DO => Implement new api that uses the same logic, new socket needed
  async function removeBatchOrdersHandler(){
    showModal(async () => {
      let removeData = [];
      for(const order of selectedReservations) removeData.push(order._id);
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

  return (
    <View>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={hideModal}
        message="Da li sigurno želiš da obrišeš selektovane rezervacije?"
      />
      {batchMode && (
        <BatchModeReservationsControlls
          active={batchMode}
          onRemoveBatchPress={removeBatchOrdersHandler}
          selectedReservations={selectedReservations}
          resetBatchMode={resetBatch}
        />
      )}
      <FlatList 
        data={data} 
        keyExtractor={(item) => item._id} 
        renderItem={({item, index}) => 
          <Pressable
            delayLongPress={100}

          >
            <ReservationItem
              order={item} 
              setEditedOrder={setEditedReservation} 
              highlightedItems={selectedReservations}
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
              <Text style={styles.listHeader}>Ukupno Rezervacija za {pickedDate}: {data.length}</Text>
            ):(
              <Text style={styles.listHeader}>Ukupno Rezervacija: {data.length}</Text>
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
      textAlign: 'center'
    },
    listContainer: {
      gap: 6,
      paddingBottom: batchMode ? 82 : 22,
      
    },
  })
}

export default ReservationsItemsList