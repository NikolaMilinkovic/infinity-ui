import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../constants/colors';

interface TopSellingTypes {
  id: string;
  name: string;
  amountSold: number;
}
interface LeastSellingTypes {
  id: string;
  name: string;
  amountSold: number;
}

interface DataTypes {
  top: TopSellingTypes[]
  least: LeastSellingTypes[]
}
interface TopAndLeastSellingProductsPropTypes {
  data: DataTypes
}
function TopAndLeastSellingProducts({ data }: TopAndLeastSellingProductsPropTypes) {
  const [topIsExpanded, setTopIsExpanded] = useState(false);
  const [leastIsExpanded, setLeastIsExpanded] = useState(false);
  const styles = getStyles(topIsExpanded, leastIsExpanded);
  return (
    <>
      <View style={[styles.container, styles.topContainer]}>
        <Pressable onPress = {() => setTopIsExpanded(!topIsExpanded)} style={[styles.pressable, styles.topBorder]}>
          <Text style={styles.header}>Najviše prodato</Text>
          <Icon name={topIsExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
        </Pressable>
        {data.top && topIsExpanded &&
          data.top.map((data, index) => (
            <DisplayData key={index} data={data}/>
        ))}
      </View>
      <View style={[styles.container, styles.leastContainer]}>
        <Pressable onPress = {() => setLeastIsExpanded(!leastIsExpanded)} style={[styles.pressable, styles.leastBorder]}>
          <Text style={styles.header}>Najmanje prodato</Text>
          <Icon name={topIsExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
        </Pressable>
        {data.least && leastIsExpanded &&
          data.least.map((data, index) => (
            <DisplayData key={index} data={data}/>
          ))}
      </View>
    </>
  );
}

function DisplayData({ data }: { data: TopSellingTypes | LeastSellingTypes;}){
  const styles = getStyles();
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Naziv proizvoda:</Text>
        <Text style={styles.info}>{data.name}</Text>
      </View>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Prodano komada:</Text>
        <Text style={styles.info}>{data.amountSold} kom.</Text>
      </View>
    </View>
  );
}
function getStyles(topIsExpanded?:boolean, leastIsExpanded?:boolean){
  return StyleSheet.create({
    container: {
      margin: 10,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 8,
      marginBottom: 0,
      elevation: 2,
      backgroundColor: Colors.primaryLight
    },
    topContainer: {
      paddingBottom: topIsExpanded ? 10 : 0,
    },
    leastContainer: {
      paddingBottom: leastIsExpanded ? 10 : 0,
    },
    pressable: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginHorizontal: 10,
    },
    topBorder: {
      borderBottomColor: Colors.primaryDark,
      borderBottomWidth: topIsExpanded ? 0.5 : 0,
    },
    leastBorder: {
      borderBottomColor: Colors.primaryDark,
      borderBottomWidth: leastIsExpanded ? 0.5 : 0,
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
      marginBottom: 0,
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

export default TopAndLeastSellingProducts