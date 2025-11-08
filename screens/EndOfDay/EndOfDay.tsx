import { useContext, useState } from 'react';
import { Animated as RNAnimated, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../../components/layout/Card';
import EndOfDayStatistics from '../../components/statistics/EndOfDayStatistics';
import { AuthContext } from '../../store/auth-context';
import { OrdersContext } from '../../store/orders-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { CourierTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import CourierSelector from '../../util-components/CourierSelector';
import CustomText from '../../util-components/CustomText';
import { popupMessage } from '../../util-components/PopupMessage';
import { generateExcellForOrders } from '../../util-methods/Excell';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';

function EndOfDay() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const orders = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const [selectedCourier, setSelectedCourier] = useState<CourierTypes>();
  const token = authCtx.token;

  async function handleOnDayEnd() {
    try {
      if (selectedCourier) {
        const filteredOrders = orders.unprocessedOrders.filter(
          (order) => order?.courier?.name === selectedCourier?.name && order.reservation === false
        );
        if (filteredOrders.length === 0) return popupMessage('Nemate preostalih porudžbina za ovog kurira', 'info');
        const excellFile = generateExcellForOrders(filteredOrders, selectedCourier.name);
        if (!excellFile) return popupMessage('Problem prilikom generisanja excell fajla', 'danger');
        const data = {
          courier: selectedCourier?.name,
          fileData: excellFile?.fileData,
          fileName: excellFile?.fileName,
        };

        const response = await fetchWithBodyData(token, 'orders/parse-orders-for-latest-period', data, 'POST');

        if (response?.status === 200) {
          const data = await response?.json();
          return popupMessage(data.message, 'success');
        } else {
          const data = await response?.json();
        }
      }
    } catch (error) {
      popupMessage('Došlo je do problema prilikom izvlačenja informacija o porudžbinama za kurira', 'danger');
      return betterErrorLog('> ERROR: ', error);
    }
  }

  function NoEndOfDayRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        height: '100%',
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        textAlign: 'center',
        color: colors.defaultText,
      },
    });

    return (
      <View style={internalStyle.container}>
        <CustomText style={internalStyle.text}>Izvucite porudžbine za danas kako bi videli statistiku.</CustomText>
      </View>
    );
  }

  return (
    <RNAnimated.View style={styles.container}>
      <View style={styles.controllsContainer}>
        <CourierSelector setSelectedCourier={setSelectedCourier} defaultValueByMatch="Bex" style={styles.dropdown} />
        <Button
          onPress={handleOnDayEnd}
          backColor={colors.buttonHighlight1}
          backColor1={colors.buttonHighlight2}
          textColor={colors.white}
        >
          Završi dan i izvuci porudžbine
        </Button>
      </View>
      <ScrollView style={styles.statisticsContainer}>
        <Card cardStyles={styles.card}>
          {orders.processedOrdersStats === null ? (
            <NoEndOfDayRenderer />
          ) : (
            <EndOfDayStatistics stats={orders.processedOrdersStats} />
          )}
        </Card>
      </ScrollView>
    </RNAnimated.View>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
    controllsContainer: {
      gap: 10,
      backgroundColor: colors.background,
      elevation: 2,
      padding: 16,
    },
    card: {
      marginBottom: 70,
    },
    statisticsContainer: {
      position: 'relative',
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'red',
      zIndex: 1,
    },
    dropdown: {
      backgroundColor: colors.background,
    },
  });
}

export default EndOfDay;
