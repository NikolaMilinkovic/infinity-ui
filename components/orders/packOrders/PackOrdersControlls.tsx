import React, { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { AuthContext } from '../../../store/auth-context';
import { useUser } from '../../../store/user-context';
import { OrderTypes } from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import InputField from '../../../util-components/InputField';
import { popupMessage } from '../../../util-components/PopupMessage';
import { fetchWithBodyData } from '../../../util-methods/FetchMethods';

interface PackOrdersControllsPropTypes {
  searchParams: any;
  setSearchParams: any;
  orders: OrderTypes[];
}
function PackOrdersControlls({ searchParams, setSearchParams, orders }: PackOrdersControllsPropTypes) {
  const [packedCounter, setPackedCounter] = useState(0);
  const [toBePackedCounter, setToBePackedCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useExpandAnimation(isExpanded, 100, 200, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 260);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const user = useUser();

  async function finishPackingHandler() {
    if (!user?.permissions?.packaging?.finish_packaging) {
      return popupMessage('Nemate dozvolu za završavanje pakovanja.', 'danger');
    }
    if (orders.length === 0) return popupMessage('Ne postoje porudžbine za pakovanje.', 'info');
    const packedIds = orders.filter((order) => order.packedIndicator === true).map((order) => order._id);
    const response = await fetchWithBodyData(token, 'orders/pack-orders', { packedIds }, 'POST');
    if (response?.status === 200) {
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

  // Category Dropdown Reset
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown() {
    setResetKey((prevKey) => prevKey + 1);
    setSearchParams((prev: any) => ({ ...prev, courier: '' }));
  }

  return (
    <Animated.View style={[styles.container, { height: height }]}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Spakovano: {packedCounter}</Text>
        {/* <Pressable style={styles.counterContainer} onPress={() => setIsExpanded(true)}>
          {!isExpanded && (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              style={styles.iconStyle}
              size={26}
              color={Colors.primaryDark}
            />
          )}
        </Pressable> */}
        <Text style={styles.counterText}>Za pakovanje: {toBePackedCounter}</Text>
      </View>
      {!isExpanded && (
        <View style={{ marginHorizontal: 10, flexDirection: 'row', gap: 8 }}>
          <InputField
            label="Pretraži"
            inputText={searchParams.query}
            setInputText={(text) => setSearchParams((prev: any) => ({ ...prev, query: text }))}
            background={Colors.white}
            labelBorders={false}
            containerStyles={[styles.inputFieldStyle, { flex: 1.35 }]}
            displayClearInputButton={true}
          />
          <Button
            containerStyles={[styles.button, styles.finishPackingButton, { flex: 1, height: 46, marginTop: 'auto' }]}
            onPress={finishPackingHandler}
            backColor={Colors.highlight}
            textColor={Colors.white}
          >
            Završi pakovanje
          </Button>
        </View>
      )}
      <Animated.View style={[styles.buttonsContainer, { opacity: toggleFade }]}>
        {isExpanded && (
          <>
            <InputField
              label="Pretraži"
              inputText={searchParams.query}
              setInputText={(text) => setSearchParams((prev: any) => ({ ...prev, query: text }))}
              background={Colors.white}
              labelBorders={false}
              containerStyles={styles.inputFieldStyle}
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
      </Animated.View>
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
  inputFieldStyle: {
    marginTop: 5,
  },
  drpodownStyle: {
    borderWidth: 0.5,
    elevation: 2,
    height: 45,
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
