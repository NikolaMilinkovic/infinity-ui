import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BasicInformationsTypes {
  fileName: string;
  excellLink: string;
  courierName: string;
  numOfOrders: number;
  totalSalesValue: number;
  averageOrderValue: number;
}
interface BasicInformationsPropTypes {
  data: BasicInformationsTypes;
}

function BasicInformationsForEndOfDay({ data }: BasicInformationsPropTypes) {
const [isExpanded, setIsExpanded] = useState(true);
const styles = getStyles(isExpanded);
  return (
    <View style={styles.container}>
      <Pressable onPress = {() => setIsExpanded(!isExpanded)} style={styles.pressable}>
        <Text style={styles.header}>Osnovna statistika:</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
      </Pressable>
      {isExpanded && (
        <View style={styles.dataContainer}>
          <View style={styles.labeledRow}>
            <Text style={styles.label}>Nziv fajla:</Text>
            <Text style={styles.info}>{data.fileName}</Text>
          </View>
          <View style={styles.labeledRow}>
            <Text style={styles.label}>Excell Download Link:</Text>
            <Text style={styles.info} numberOfLines={1} ellipsizeMode="tail">{data.excellLink}</Text>
          </View>
          <View style={styles.labeledRow}>
            <Text style={styles.label}>Kurir:</Text>
            <Text style={styles.info}>{data.courierName} rsd.</Text>
          </View>
          <View style={styles.labeledRow}>
            <Text style={styles.label}>Prodato komada:</Text>
            <Text style={styles.info}>{data.numOfOrders} kom.</Text>
          </View>
          <View style={styles.labeledRow}>
            {/* TO DO, staviti da radnici ne mogu ovo da vide, samo admini */}
            <Text style={styles.label}>Ukupna vrednost:</Text>
            {/* <Text style={styles.info}>{data.totalSalesValue} rsd.</Text> */}
            <Text style={styles.info}>N / A</Text>
          </View>
          <View style={styles.labeledRow}>
            <Text style={styles.label}>Prosečna vrednost porudžbine:</Text>
            <Text style={styles.info}>{data.averageOrderValue} rsd.</Text>
          </View>
        </View>
      )}
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

export default BasicInformationsForEndOfDay;
