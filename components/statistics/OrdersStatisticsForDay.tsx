import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { ProcessedOrderStatisticsFileTypes } from '../../types/allTsTypes';
import IconButton from '../../util-components/IconButton';
import { createdAtIntoDateFormatter } from '../../util-methods/DateFormatters';
import { downloadAndShareFileViaLink } from '../../util-methods/FetchMethods';
import BasicInformationsForEndOfDay from './statsDisplays/BasicInformations';
import OrdersByCategory from './statsDisplays/OrdersByCategory';
import PerColorSold from './statsDisplays/PerColorSold';
import PerLocationStats from './statsDisplays/PerLocationStats';
import PerProductStats from './statsDisplays/PerProductStats';
import SalesPerStockType from './statsDisplays/SalesPerStockType';
import TopAndLeastSellingProducts from './statsDisplays/TopAndLeastSellingProducts';

interface PropTypes {
  stats: ProcessedOrderStatisticsFileTypes;
}
function OrdersStatisticsForDay({ stats }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  function handleExpandToggle() {
    setIsExpanded(!isExpanded);
  }
  createdAtIntoDateFormatter;
  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleExpandToggle}
        style={({ pressed }) => [styles.controllsContainer, globalStyles.border, pressed && { opacity: 0.6 }]}
      >
        <View
          style={{
            flex: 8,
            flexDirection: 'column',
          }}
        >
          <Text style={[styles.header]} numberOfLines={1} ellipsizeMode="tail">
            {stats.courierName}
          </Text>
          <Text style={[styles.date, { marginRight: 20 }]} numberOfLines={1} ellipsizeMode="tail">
            {createdAtIntoDateFormatter(stats.createdAt)}
          </Text>
        </View>
        {/* <Text style={styles.header}> */}
        {/* </Text> */}
        <IconButton
          icon="share"
          size={20}
          color={colors.white}
          onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
          style={styles.shareBtn}
          backColor={colors.buttonHighlight1}
          backColor1={colors.buttonHighlight2}
        />
      </Pressable>
      {isExpanded && (
        <View style={[styles.informationOutlineContainer, globalStyles.border]}>
          <BasicInformationsForEndOfDay
            data={{
              fileName: stats.fileName,
              excellLink: stats.excellLink,
              courierName: stats.courierName,
              numOfOrders: stats.numOfOrders,
              totalSalesValue: stats.totalSalesValue,
              averageOrderValue: stats.averageOrderValue,
            }}
          />
          <PerProductStats data={stats.perProductStats} />
          <TopAndLeastSellingProducts
            data={{
              top: stats.topSellingProducts,
              least: stats.leastSellingProducts,
            }}
          />
          <SalesPerStockType data={stats.salesPerStockType} />
          <OrdersByCategory data={stats.numOfOrdersByCategory} />
          <PerColorSold data={stats.perColorSold} />
          <PerLocationStats data={stats.perLocationSales} />
        </View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 0,
      marginBottom: 0,
    },
    controllsContainer: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.highlightText,
      textAlign: 'left',
    },
    date: {
      fontSize: 14,
      color: colors.grayText,
      textAlign: 'left',
    },
    shareBtn: {
      borderRadius: 100,
      overflow: 'hidden',
      elevation: 4,
      backgroundColor: colors.highlight1,
      maxWidth: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 2,
    },
    informationOutlineContainer: {
      padding: 10,
      flexDirection: 'column',
      gap: 10,
      backgroundColor: colors.buttonNormal1,
      marginTop: 8,
    },
  });
}

export default OrdersStatisticsForDay;
