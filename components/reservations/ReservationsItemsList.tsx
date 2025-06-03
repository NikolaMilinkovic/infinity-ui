import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import useBatchSelectBackHandler from '../../hooks/useBatchSelectBackHandler';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import { useFadeTransition } from '../../hooks/useFadeTransition';
import { AuthContext } from '../../store/auth-context';
import { OrderTypes } from '../../types/allTsTypes';
import ConfirmationModal from '../../util-components/ConfirmationModal';
import { popupMessage } from '../../util-components/PopupMessage';
import { getFormattedDateWithoutTime } from '../../util-methods/DateFormatters';
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods';
import BatchModeReservationsControlls from './BatchModeReservationsControlls';
import ReservationItem from './ReservationItem';

interface RenderPropType {
  item: OrderTypes;
}
interface DataTypes {
  date: Date;
  reservations: OrderTypes[];
}
interface PropTypes {
  data: DataTypes[];
  setEditedReservation: (order: OrderTypes | null) => void;
  isDatePicked: boolean;
  pickedDate: string;
}
interface SelectedOrdersTypes {
  _id: string;
}
function ReservationsItemsList({ data, setEditedReservation, isDatePicked, pickedDate }: PropTypes) {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState<SelectedOrdersTypes[]>([]);
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const authCtx = useContext(AuthContext);
  const styles = getStyles(batchMode);
  const token = authCtx.token;
  function resetBatch() {
    setBatchMode(false);
    setSelectedReservations([]);
  }
  useBatchSelectBackHandler(batchMode, resetBatch);

  const [longPressActivated, setLongPressActivated] = useState(false);
  function handleLongPress(orderId: string) {
    if (batchMode) return;
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
    if (selectedReservations.length === 0) setSelectedReservations([{ _id: orderId }]);
    setBatchMode(true);
  }
  // Press handler after select mode is initialized
  function handlePress(orderId: string) {
    if (!batchMode) return;
    if (longPressActivated) return;
    if (selectedReservations.length === 0) return;
    const isIdSelected = selectedReservations?.some((presentItem) => presentItem._id === orderId);
    if (isIdSelected) {
      if (selectedReservations.length === 1) setBatchMode(false);
      setSelectedReservations(selectedReservations.filter((order) => order._id !== orderId));
    } else {
      setSelectedReservations((prev) => [...prev, { _id: orderId }]);
    }
  }

  // TO DO => Implement new api that uses the same logic, new socket needed
  async function removeBatchOrdersHandler() {
    showModal(async () => {
      let removeData = [];
      for (const order of selectedReservations) removeData.push(order._id);
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

  const [numOfReservations, setNumOfReservations] = useState(0);
  useEffect(() => {
    let count = 0;
    for (const obj of data) {
      count += obj.reservations.length;
    }
    setNumOfReservations(count);
  }, [data]);

  return (
    <View style={{ flex: 1, minHeight: '100%' }}>
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
        keyExtractor={(item, index) => `item-${index}-${item.date}`}
        renderItem={({ item, index }) => (
          <ReservationsGroup
            data={item}
            setEditedReservation={setEditedReservation}
            selectedReservations={selectedReservations}
            batchMode={batchMode}
            handlePress={handlePress}
            handleLongPress={handleLongPress}
            key={`${index}-${item.date}`}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => {
          return isDatePicked ? (
            <Text style={styles.listHeader}>
              Ukupno Rezervacija za {pickedDate}: {numOfReservations}
            </Text>
          ) : (
            <Text style={styles.listHeader}>Ukupno Rezervacija: {numOfReservations}</Text>
          );
        }}
        initialNumToRender={10}
      />
    </View>
  );
}

interface ItemTypes {
  date: Date;
  reservations: OrderTypes;
}

function ReservationsGroup({
  data,
  setEditedReservation,
  selectedReservations,
  batchMode,
  handlePress,
  handleLongPress,
}: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const fade = useFadeTransition(isExpanded, 280);

  return (
    <>
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={ResGroupStyles.headerContainer}>
        <Text style={ResGroupStyles.header}>
          {getFormattedDateWithoutTime(data.date)} Rezervacija: {data.reservations.length}
        </Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={ResGroupStyles.iconStyle}
          size={26}
          color={Colors.white}
        />
      </Pressable>
      <Animated.View style={fade}>
        {isExpanded && (
          <>
            <FlatList
              data={data.reservations}
              style={ResGroupStyles.list}
              keyExtractor={(item, index) => `list-${index}`}
              renderItem={({ item }) => (
                <Pressable delayLongPress={100}>
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
              )}
              initialNumToRender={10}
            />
          </>
        )}
      </Animated.View>
    </>
  );
}

function getStyles(batchMode: boolean) {
  return StyleSheet.create({
    list: {
      paddingHorizontal: 10,
    },
    listHeader: {
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
    },
    listContainer: {
      gap: 6,
      paddingBottom: batchMode ? 82 : 22,
      backgroundColor: Colors.primaryLight,
      overflow: 'hidden',
    },
  });
}

const ResGroupStyles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  container: {
    paddingHorizontal: 8,
  },
  list: {
    gap: 5,
  },
});

export default ReservationsItemsList;
