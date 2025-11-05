import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import Accordion from '../../accordion/Accordion';

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
  top: TopSellingTypes[];
  least: LeastSellingTypes[];
}
interface TopAndLeastSellingProductsPropTypes {
  data: DataTypes;
}
function TopAndLeastSellingProducts({ data }: TopAndLeastSellingProductsPropTypes) {
  const [topIsExpanded, setTopIsExpanded] = useState(false);
  // const [leastIsExpanded, setLeastIsExpanded] = useState(false);

  return (
    <>
      <Accordion isExpanded={topIsExpanded} setIsExpanded={setTopIsExpanded} title="Najviše prodato">
        {data.top && data.top.map((data, index) => <DisplayData key={`${index}-najvise-prodato`} data={data} />)}
      </Accordion>
      {/* <Accordion isExpanded={leastIsExpanded} setIsExpanded={setLeastIsExpanded} title="Najmanje prodato">
        {data.least && data.least.map((data, index) => <DisplayData key={`${index}-najmanje-prodato`} data={data} />)}
      </Accordion> */}
    </>
  );
}

function DisplayData({ data }: { data: TopSellingTypes | LeastSellingTypes }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.dataContainer}>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Naziv proizvoda:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {data.name}
        </CustomText>
      </View>
      <View style={styles.labeledRow}>
        <CustomText style={styles.label}>Prodano komada:</CustomText>
        <CustomText variant="bold" style={styles.info}>
          {data.amountSold} kom.
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

export default TopAndLeastSellingProducts;
