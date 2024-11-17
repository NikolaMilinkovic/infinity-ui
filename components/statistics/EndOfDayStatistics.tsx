import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { popupMessage } from '../../util-components/PopupMessage';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import { downloadAndShareFileViaLink } from '../../util-methods/FetchMethods';
import SalesPerStockType from './statsDisplays/SalesPerStockType';
import TopAndLeastSellingProducts from './statsDisplays/TopAndLeastSellingProducts';
import PerColorSold from './statsDisplays/PerColorSold';
import OrdersByCategory from './statsDisplays/OrdersByCategory';
import PerLocationStats from './statsDisplays/PerLocationStats';
import PerProductStats from './statsDisplays/PerProductStats';
import BasicInformationsForEndOfDay from './statsDisplays/BasicInformations';
import IconButton from '../../util-components/IconButton';

function EndOfDayStatistics({ stats }) {

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)} style={styles.controllsContainer}>
        <Text style={styles.header}>Statistika za {stats.courierName}</Text>
        <IconButton
          icon = 'share'
          size={20}
          color ={Colors.white}
          onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
          style={styles.shareBtn}
        />
      </Pressable>
      <BasicInformationsForEndOfDay
        data = {{
          fileName: stats.fileName,
          excellLink: stats.excellLink,
          courierName: stats.courierName,
          numOfOrders: stats.numOfOrders,
          totalSalesValue: stats.totalSalesValue,
          averageOrderValue: stats.averageOrderValue,
        }}
      />
      <PerProductStats
        data={stats.perProductStats}
      />
      <TopAndLeastSellingProducts 
        data = {{
          top: stats.topSellingProducts,
          least: stats.leastSellingProducts,
        }}
      />
      <SalesPerStockType
        data={stats.salesPerStockType}
      />
      <OrdersByCategory
        data={stats.numOfOrdersByCategory}
      />
      <PerColorSold
        data={stats.perColorSold}
      />
      <PerLocationStats
        data={stats.perLocationSales}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  controllsContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primaryDark,
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    elevation: 2,
    backgroundColor: Colors.primaryLight
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    flex: 8,
  },
  shareBtn: {
    borderRadius: 100,
    elevation: 4,
    backgroundColor: Colors.highlight,
    padding: 16,
    maxWidth: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  }
})

export default EndOfDayStatistics