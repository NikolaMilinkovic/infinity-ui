import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OrdersByCategoryTypes {
  category: string;
  amountSold: number;
  totalValue: number;
}
interface OrdersByCategoryPropTypes {
  data: OrdersByCategoryTypes[];
}

function OrdersByCategory({ data }: OrdersByCategoryPropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = getStyles(isExpanded);
  return (
    <View style={styles.container}>
      <Pressable onPress = {() => setIsExpanded(!isExpanded)} style={styles.pressable}>
        <Text style={styles.header}>Kategorija</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
      </Pressable>
      {data && isExpanded &&
        data.map((categoryData, index) => (
          <DisplayOrdersByCategoryData key={index} categoryData={categoryData} />
        ))}
    </View>
  );
}

function DisplayOrdersByCategoryData({
  categoryData,
}: {
  categoryData: OrdersByCategoryTypes;
}) {
  const styles = getStyles();
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Kategorija:</Text>
        <Text style={styles.info}>{categoryData.category}</Text>
      </View>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Prodato komada:</Text>
        <Text style={styles.info}>{categoryData.amountSold} kom.</Text>
      </View>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Ukupna vrednost:</Text>
        <Text style={styles.info}>{categoryData.totalValue} rsd.</Text>
      </View>
    </View>
  );
}

function getStyles(isExpanded?: boolean){
  return StyleSheet.create({
    container: {
      margin: 10,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: Colors.primaryLight,
      marginBottom: 0,
    },
    pressable: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderBottomColor: Colors.primaryDark,
      borderBottomWidth: isExpanded ? 0.5 : 0,
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
      marginBottom: 4,
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
}

export default OrdersByCategory;
