import React, { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { AuthContext } from '../../../store/auth-context';
import { CouriersContext } from '../../../store/couriers-context';
import { CategoryTypes, OrderTypes } from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import DropdownList from '../../../util-components/DropdownList';
import { popupMessage } from '../../../util-components/PopupMessage';
import { fetchWithBodyData } from '../../../util-methods/FetchMethods';

interface PackOrdersControllsPropTypes {
  selectedCourier: CategoryTypes | null;
  setSelectedCourier: (courier: CategoryTypes | null) => void;
  orders: OrderTypes[];
}
function PackOrdersControlls({ selectedCourier, setSelectedCourier, orders }: PackOrdersControllsPropTypes) {
  const [packedCounter, setPackedCounter] = useState(0);
  const [toBePackedCounter, setToBePackedCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const height = useExpandAnimation(isExpanded, 40, 200, 180);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  async function finishPackingHandler() {
    const packedIds = orders.filter((order) => order.packedIndicator === true).map((order) => order._id);
    const response = await fetchWithBodyData(token, 'orders/pack-orders', { packedIds }, 'POST');
    if (response.status === 200) {
      const data = await response?.json();
      return popupMessage(data.message, 'success');
    } else {
      const data = await response?.json();
      return popupMessage(data.message, 'danger');
    }
  }

  useEffect(() => {
    const { isPacked, toBePacked } = orders.reduce(
      (acc, order) => {
        if (order.packedIndicator && order.packed === false) {
          acc.isPacked += 1;
        } else {
          if (order.packed === false) acc.toBePacked += 1;
        }
        return acc;
      },
      { isPacked: 0, toBePacked: 0 }
    );

    setPackedCounter(isPacked);
    setToBePackedCounter(toBePacked);
  }, [orders]);

  // CATEGORY FILTER
  const couriersCtx = useContext(CouriersContext);
  useEffect(() => {
    if (selectedCourier && selectedCourier?.name === 'Resetuj izbor') {
      resetDropdown();
      return;
    }
  }, [selectedCourier]);

  // Category Dropdown Reset
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown() {
    setResetKey((prevKey) => prevKey + 1);
    setSelectedCourier(null);
  }

  return (
    <Animated.View style={[styles.container, { height: height }]}>
      <Pressable style={styles.counterContainer} onPress={() => setIsExpanded(true)}>
        <Text style={styles.counterText}>Spakovano: {packedCounter}</Text>
        {!isExpanded && (
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            style={styles.iconStyle}
            size={26}
            color={Colors.primaryDark}
          />
        )}
        <Text style={styles.counterText}>Za pakovanje: {toBePackedCounter}</Text>
      </Pressable>
      <View style={styles.buttonsContainer}>
        {isExpanded && (
          <>
            <DropdownList
              buttonContainerStyles={styles.button}
              key={resetKey}
              data={[{ _id: '', name: 'Resetuj izbor' }, ...couriersCtx.couriers]}
              onSelect={setSelectedCourier}
              placeholder="Izaberite kurira"
              isDefaultValueOn={false}
            />
            <Button
              containerStyles={[styles.button, styles.finishPackingButton]}
              onPress={finishPackingHandler}
              backColor={Colors.highlight}
              textColor={Colors.white}
            >
              Završi pakovanje
            </Button>
            <Button onPress={() => setIsExpanded(() => !isExpanded)} containerStyles={styles.chevronButton}>
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                style={styles.iconStyle}
                size={26}
                color={Colors.primaryDark}
              />
            </Button>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    backgroundColor: Colors.white,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
  },
  finishPackingButton: {
    height: 50,
    position: 'static',
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  button: {
    borderWidth: 0,
    elevation: 2,
  },
  chevronButton: {
    elevation: 0,
    height: 40,
  },
  iconStyle: {},
});

export default PackOrdersControlls;
