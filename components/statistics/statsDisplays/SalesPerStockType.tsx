import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import { formatPrice } from '../../../util-methods/formatPrice';
import Accordion from '../../accordion/Accordion';

interface SalesPerStockType {
  stockType: string;
  amountSold: number;
  totalValue: number;
}
interface SalesPerStockTypePropTypes {
  data: SalesPerStockType[];
}

function SalesPerStockType({ data }: SalesPerStockTypePropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Accordion isExpanded={isExpanded} setIsExpanded={setIsExpanded} title="Tip proizvoda">
      {data && data.map((stockTypeData, index) => <DisplayStockTypeData key={index} stockTypeData={stockTypeData} />)}
    </Accordion>
  );
}

function DisplayStockTypeData({ stockTypeData }: { stockTypeData: SalesPerStockType }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Vrsta proizvoda:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {stockTypeData.stockType}
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Prodato komada:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {stockTypeData.amountSold} kom.
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Ukupna vrednost:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {formatPrice(stockTypeData.totalValue)} rsd.
        </CustomText>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    dataContainer: {
      padding: 12,
      backgroundColor: 'transparent',
      marginVertical: 10,
    },
    labeledRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    label: {
      flex: 1,
      fontWeight: '600',
      color: colors.defaultText,
    },
    info: {
      flex: 1,
      textAlign: 'right',
      color: colors.defaultText,
    },
  });
}

export default SalesPerStockType;
