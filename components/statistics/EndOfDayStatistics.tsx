import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { popupMessage } from '../../util-components/PopupMessage';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import { downloadAndShareFileViaLink } from '../../util-methods/FetchMethods';
import SalesPerStockType from './statsDisplays/SalesPerStockType';
import TopAndLeastSellingProducts from './statsDisplays/TopAndLeastSellingProducts';

function EndOfDayStatistics({ stats }) {

  return (
    <ScrollView style={styles.container}>
      <Button
        onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
        backColor={Colors.secondaryLight}
        textColor={Colors.primaryDark}
      >
        Prosledi Excell Fajl
      </Button>
      <View>
        {/* FILE NAME */}
        <View style={styles.labeledRow}>
          <Text style={styles.label}>Naziv fajla:</Text>
          <Text style={styles.info}>{stats.fileName}</Text>
        </View>
        {/* COURIER NAME */}
        <View style={styles.labeledRow}>
          <Text style={styles.label}>Kurir:</Text>
          <Text style={styles.info}>{stats.courierName}</Text>
        </View>
        {/* NUM OF ORDERS */}
        <View style={styles.labeledRow}>
          <Text style={styles.label}>Broj porudžbina:</Text>
          <Text style={styles.info}>{stats.numOfOrders} porudžbina</Text>
        </View>
        {/* TOTAL SALES VALUE */}
        <View style={styles.labeledRow}>
          <Text style={styles.label}>Ukupna vrednost:</Text>
          <Text style={styles.info}>{stats.totalSalesValue} rsd</Text>
        </View>
        {/* AVG ORDER VALUE */}
        <View style={styles.labeledRow}>
          <Text style={styles.label}>Prosecna vrednost porudžbine:</Text>
          <Text style={styles.info}>{stats.averageOrderValue} rsd</Text>
        </View>
        {/* SALES PER STOCK TYPE */}
      </View>
      <SalesPerStockType
        data={stats.salesPerStockType}
      />
      <TopAndLeastSellingProducts 
        data = {{
          top: stats.topSellingProducts,
          least: stats.leastSellingProducts,
        }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    paddingBottom: 50,
  },
  labeledRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  label: {
    flex: 2,
    fontWeight: 'bold',
  },
  info: {
    flex: 3,
    textAlignVertical: 'center'
  }
})

export default EndOfDayStatistics