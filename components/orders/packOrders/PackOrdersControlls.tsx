import { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { AuthContext } from '../../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
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
  const colors = useThemeColors();
  const styles = getStyles(colors);

  async function finishPackingHandler() {
    if (!user?.permissions?.packaging?.finish_packaging) {
      return popupMessage('Nemate dozvolu za završavanje pakovanja.', 'danger');
    }
    const packedIds = orders.filter((order) => order.packedIndicator === true).map((order) => order._id);
    if (packedIds.length === 0) return popupMessage('Ne postoje porudžbine označene za pakovanje.', 'info');
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

  return (
    <Animated.View style={[styles.container, { height: height }]}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Spakovano: {packedCounter}</Text>
        <Text style={styles.counterText}>Za pakovanje: {toBePackedCounter}</Text>
      </View>
      {!isExpanded && (
        <View style={{ marginHorizontal: 10, flexDirection: 'row', gap: 8 }}>
          <InputField
            label="Pretraži"
            inputText={searchParams.query}
            setInputText={(text) => setSearchParams((prev: any) => ({ ...prev, query: text }))}
            background={colors.background}
            labelBorders={false}
            containerStyles={[styles.inputFieldStyle, { flex: 1.35 }]}
            displayClearInputButton={true}
            activeColor={colors.highlight}
            selectionColor={colors.highlight}
          />
          <Button
            containerStyles={[styles.button, styles.finishPackingButton]}
            onPress={finishPackingHandler}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
            textColor={colors.whiteText}
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
              background={colors.background}
              labelBorders={false}
              containerStyles={styles.inputFieldStyle}
            />
            <Button
              containerStyles={[styles.button, styles.finishPackingButton]}
              onPress={finishPackingHandler}
              backColor={colors.buttonHighlight1}
              backColor1={colors.buttonHighlight2}
              textColor={colors.whiteText}
            >
              Završi pakovanje
            </Button>
            <Button onPress={() => setIsExpanded(() => !isExpanded)} containerStyles={styles.chevronButton}>
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                style={styles.iconStyle}
                size={26}
                color={colors.defaultText}
              />
            </Button>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      elevation: 2,
      backgroundColor: colors.background,
    },
    counterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 8,
      alignItems: 'center',
    },
    counterText: {
      fontSize: 14,
      color: colors.defaultText,
    },
    finishPackingButton: {
      height: 44,
      flex: 1,
      marginTop: 'auto',
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
}
export default PackOrdersControlls;
