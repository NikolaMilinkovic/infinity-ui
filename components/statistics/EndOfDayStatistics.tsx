import { Pressable, StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import CustomText from '../../util-components/CustomText';
import IconButton from '../../util-components/IconButton';
import { downloadAndShareFileViaLink } from '../../util-methods/FetchMethods';
import BasicInformationsForEndOfDay from './statsDisplays/BasicInformations';
import OrdersByCategory from './statsDisplays/OrdersByCategory';
import PerColorSold from './statsDisplays/PerColorSold';
import PerLocationStats from './statsDisplays/PerLocationStats';
import PerProductStats from './statsDisplays/PerProductStats';
import SalesPerStockType from './statsDisplays/SalesPerStockType';
import TopAndLeastSellingProducts from './statsDisplays/TopAndLeastSellingProducts';

function EndOfDayStatistics({ stats }: any) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  return (
    <>
      {stats && (
        <View style={styles.container}>
          <View style={{ gap: 6, paddingBottom: 4 }}>
            <Pressable
              onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
              style={[styles.controllsContainer, globalStyles.elevation_1, globalStyles.border]}
            >
              <CustomText variant="bold" style={styles.header}>
                Statistika za {stats.courierName}
              </CustomText>
              <IconButton
                icon="share"
                size={20}
                color={colors.white}
                onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
                style={styles.shareBtn}
                backColor={colors.buttonHighlight1}
                backColor1={colors.buttonHighlight2}
                pressedStyles={{}}
              />
            </Pressable>
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
        </View>
      )}
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      gap: 6,
    },
    controllsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: colors.buttonNormal1,
    },
    header: {
      fontSize: 18,
      color: colors.defaultText,
      textAlign: 'center',
      flex: 8,
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
  });
}

export default EndOfDayStatistics;
