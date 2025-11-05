import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import { formatPrice } from '../../../util-methods/formatPrice';
import Accordion from '../../accordion/Accordion';

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
  return (
    <Accordion isExpanded={isExpanded} setIsExpanded={setIsExpanded} title="Kategorija">
      {data &&
        data.map((categoryData, index) => <DisplayOrdersByCategoryData key={index} categoryData={categoryData} />)}
    </Accordion>
  );
}

function DisplayOrdersByCategoryData({ categoryData }: { categoryData: OrdersByCategoryTypes }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Kategorija:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {categoryData.category}
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Prodato komada:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {categoryData.amountSold} kom.
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Ukupna vrednost:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {formatPrice(categoryData.totalValue)} rsd.
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

export default OrdersByCategory;
