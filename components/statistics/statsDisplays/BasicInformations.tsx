import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import { formatPrice } from '../../../util-methods/formatPrice';
import Accordion from '../../accordion/Accordion';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <Accordion isExpanded={isExpanded} setIsExpanded={setIsExpanded} title="Osnovna statistika">
      <View style={styles.dataContainer}>
        <View style={styles.labeledRow}>
          <CustomText style={styles.label}>Naziv fajla:</CustomText>
          <CustomText variant="bold" style={styles.info}>
            {data.fileName}
          </CustomText>
        </View>
        <View style={styles.labeledRow}>
          <CustomText style={styles.label}>Kurir:</CustomText>
          <CustomText variant="bold" style={styles.info}>
            {data.courierName}
          </CustomText>
        </View>
        <View style={styles.labeledRow}>
          <CustomText style={styles.label}>Prodato komada:</CustomText>
          <CustomText variant="bold" style={styles.info}>
            {data.numOfOrders} kom.
          </CustomText>
        </View>
        <View style={styles.labeledRow}>
          {/* TO DO, staviti da radnici ne mogu ovo da vide, samo admini */}
          <CustomText style={styles.label}>Ukupna vrednost:</CustomText>
          <CustomText variant="bold" style={styles.info}>
            {formatPrice(data.totalSalesValue)} rsd.
          </CustomText>
        </View>
        <View style={styles.labeledRow}>
          <CustomText style={styles.label}>Prosečna vrednost porudžbine:</CustomText>
          <CustomText variant="bold" style={styles.info}>
            {formatPrice(data.averageOrderValue)} rsd.
          </CustomText>
        </View>
      </View>
    </Accordion>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    dataContainer: {
      padding: 12,
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

export default BasicInformationsForEndOfDay;
