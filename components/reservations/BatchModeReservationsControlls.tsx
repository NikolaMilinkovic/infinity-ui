import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import useAuthToken from '../../hooks/useAuthToken';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { CourierTypes } from '../../types/allTsTypes';
import CourierSelector from '../../util-components/CourierSelector';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';

interface PropTypes {
  active: boolean;
  onRemoveBatchPress: () => void;
  selectedReservations: string[];
  resetBatchMode: () => void;
}
function BatchModeReservationsControlls({
  active,
  onRemoveBatchPress,
  selectedReservations,
  resetBatchMode,
}: PropTypes) {
  useEffect(() => {
    setIsExpanded(active);
  }, [active]);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 60, 100);
  const token = useAuthToken();
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  const [selectedCourier, setSelectedCourier] = useState<CourierTypes | null>(null);
  async function saveReservationsAsOrders() {
    try {
      const data = {
        courier: {
          name: selectedCourier?.name,
          deliveryPrice: Number(selectedCourier?.deliveryPrice),
        },
        reservations: selectedReservations,
      };
      resetBatchMode();
      const response = await fetchWithBodyData(token, 'orders/reservations-to-orders', data, 'POST');

      if (response?.status === 200) {
        const data = await response?.json();
        return popupMessage(data.message, 'success');
      } else {
        const data = await response?.json();
        return popupMessage(data.message, 'danger');
      }
    } catch (error) {
      betterErrorLog('> Error while moving reservations to orders', error);
      popupMessage('Došlo je do problema prilikom prebacivanja rezervacija u porudžbine', 'danger');
    }
  }

  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          <View style={styles.couriersContainer}>
            <CourierSelector style={styles.courierSelector} setSelectedCourier={setSelectedCourier} />
            <IconButton
              size={26}
              color={colors.primaryDark}
              onPress={saveReservationsAsOrders}
              key={`key-remove-batch-button`}
              icon="check"
              style={[styles.saveToCourrierButton, globalStyles.border, globalStyles.elevation_1]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
            />
          </View>
          <IconButton
            size={22}
            color={colors.highlight}
            onPress={onRemoveBatchPress}
            key={`key-remove-batch-button`}
            icon="delete"
            style={[styles.removeBatchItemsButton, globalStyles.border, globalStyles.elevation_1]}
            pressedStyles={styles.removeBatchItemsButtonPressed}
          />
        </Animated.View>
      )}
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      backgroundColor: colors.primaryLight,
      flexDirection: 'row',
    },
    couriersContainer: {
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      gap: 10,
    },
    courierSelector: {
      backgroundColor: colors.white,
      height: 40,
      flex: 1,
    },
    saveToCourrierButton: {
      backgroundColor: colors.white,
      width: 50,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    removeBatchItemsButton: {
      margin: 10,
      backgroundColor: colors.white,
      width: 50,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    removeBatchItemsButtonPressed: {
      opacity: 0.7,
      elevation: 1,
    },
  });
}

export default BatchModeReservationsControlls;
