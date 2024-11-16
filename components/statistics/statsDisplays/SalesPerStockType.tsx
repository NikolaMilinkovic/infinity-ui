import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { betterConsoleLog } from '../../../util-methods/LogMethods';
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import Button from '../../../util-components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SalesPerStockType {
  stockType: string;
  amountSold: number;
  totalValue: number;
}
interface SalesPerStockTypePropTypes {
  data: SalesPerStockType[];
}

function SalesPerStockType({ data }: SalesPerStockTypePropTypes) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <View style={styles.container}>
      <Pressable onPress = {() => setIsExpanded(!isExpanded)} style={styles.pressable}>
        <Text style={styles.header}>Statistika po tipu proizvoda</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
      </Pressable>
      {data && isExpanded &&
        data.map((stockTypeData, index) => (
          <DisplayStockTypeData key={index} stockTypeData={stockTypeData} />
        ))}
    </View>
  );
}

function DisplayStockTypeData({
  stockTypeData,
}: {
  stockTypeData: SalesPerStockType;
}) {
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Vrsta proizvoda:</Text>
        <Text style={styles.info}>{stockTypeData.stockType}</Text>
      </View>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Prodato komada:</Text>
        <Text style={styles.info}>{stockTypeData.amountSold} kom.</Text>
      </View>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Ukupna vrednost:</Text>
        <Text style={styles.info}>{stockTypeData.totalValue} rsd.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    marginBottom: 0,
  },
  pressable: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderBottomColor: Colors.primaryDark,
    borderBottomWidth: 0.5,
    marginHorizontal: 10,
  },
  iconStyle: {
    flex: 2
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.primaryDark,
    textAlign: 'center',
    flex: 20,
  },
  dataContainer: {
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 8,
    backgroundColor: Colors.secondaryLight,
    margin: 10,
  },
  labeledRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: '600',
    color: Colors.secondaryDark,
  },
  info: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
});

export default SalesPerStockType;
