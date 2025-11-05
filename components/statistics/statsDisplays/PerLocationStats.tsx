import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import { formatPrice } from '../../../util-methods/formatPrice';
import Accordion from '../../accordion/Accordion';

interface PerLocationStatsTypes {
  location: string;
  amountSold: number;
  totalValue: number;
}
interface PerLocationStatsPropTypes {
  data: PerLocationStatsTypes[];
}

function PerLocationStats({ data }: PerLocationStatsPropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Accordion isExpanded={isExpanded} setIsExpanded={setIsExpanded} title="Lokacija">
      {data && data.map((locationData, index) => <PerLocationStatsData key={index} locationData={locationData} />)}
    </Accordion>
  );
}

function PerLocationStatsData({ locationData }: { locationData: PerLocationStatsTypes }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Lokacija:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {locationData.location}
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Prodato komada:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {locationData.amountSold} kom.
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Ukupna vrednost:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {formatPrice(locationData.totalValue)} rsd.
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

export default PerLocationStats;
