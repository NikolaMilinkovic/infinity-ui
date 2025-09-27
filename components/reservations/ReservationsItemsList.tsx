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

import { MaterialIcons } from '@expo/vector-icons';
import { useHighlightAnimation } from '../../hooks/useHighlightAnimation';
type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;

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
      if (!token) return popupMessage('Auth token nije pronađen!', 'warning');
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
            setSelectedReservations={setSelectedReservations}
            batchMode={batchMode}
            setBatchMode={setBatchMode}
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
  setSelectedReservations,
  batchMode,
  setBatchMode,
  handlePress,
  handleLongPress,
}: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const fade = useFadeTransition(isExpanded, 280);

  const allSelected = data.reservations.every((r: OrderTypes) => selectedReservations.some((s) => s._id === r._id));

  function toggleSelectAll() {
    setSelectedReservations((prev: SelectedOrdersTypes[]) => {
      if (allSelected) {
        // Remove all group reservations from selected
        const updated = prev.filter((s) => !data.reservations.some((r: OrderTypes) => r._id === s._id));
        // Turn off batch mode if nothing left
        if (updated.length === 0) setBatchMode(false);
        return updated;
      } else {
        setBatchMode(true);
        // Add all group reservations to selected
        const notSelected = data.reservations.filter((r: OrderTypes) => !prev.some((s) => s._id === r._id));
        return [...prev, ...notSelected.map((r) => ({ _id: r._id }))];
      }
    });
  }

  const backgroundColorHighlighted = useHighlightAnimation({
    batchMode,
    duration: 120,
    highlightColor: '#A3B9CC',
  });

  return (
    <>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={[
          ResGroupStyles.headerContainer,
          allSelected &&
            {
              // borderWidth: 4,
              // borderColor: Colors.highlight,
              // padding: 6,
            },
        ]}
        delayLongPress={200}
        onLongPress={toggleSelectAll}
      >
        {allSelected && <Animated.View style={[ResGroupStyles.highlightBox, {}]}></Animated.View>}
        {/* {batchMode && (
          <Pressable onPress={toggleSelectAll} style={ResGroupStyles.highlightAllBtn}>
            {allSelected && <MaterialIcons name={'check'} color={Colors.white} size={22} />}
          </Pressable>
        )} */}
        <Text style={ResGroupStyles.header}>
          {getFormattedDateWithoutTime(data.date)} Ukupno: {data.reservations.length} kom.
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
    height: 50,
    position: 'relative',
  },
  iconStyle: {
    marginLeft: 'auto',
    zIndex: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 8,
    zIndex: 3,
  },
  container: {
    paddingHorizontal: 8,
  },
  list: {
    gap: 5,
  },
  highlightAllBtn: {
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    width: 30,
    borderRadius: 50,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightAllActive: {
    backgroundColor: Colors.secondaryLight,
    flex: 1,
    borderRadius: 4,
  },
  iconCheckStyle: {
    fontWeight: 'bold',
  },
  highlightBox: {
    position: 'absolute',
    // flex: 1,
    backgroundColor: '#A3B9CC',
    zIndex: 2,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.25,
  },
});

export default ReservationsItemsList;
