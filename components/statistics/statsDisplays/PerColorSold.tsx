import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import Accordion from '../../accordion/Accordion';

interface PerColorSoldTypes {
  color: string;
  amountSold: number;
}
interface PerColorSoldPropTypes {
  data: PerColorSoldTypes[];
}

function PerColorSold({ data }: PerColorSoldPropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Accordion title="Boja" isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
      {data && data.map((colorData, index) => <DisplayPerColorData key={index} colorData={colorData} />)}
    </Accordion>
  );
}

function DisplayPerColorData({ colorData }: { colorData: PerColorSoldTypes }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.dataContainer]}>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Boja:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {colorData.color}
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Prodato komada:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {colorData.amountSold} kom.
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

export default PerColorSold;
