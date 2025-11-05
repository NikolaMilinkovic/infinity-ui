import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useGlobalStyles } from '../../../../../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../../../../../store/theme-context';
import ColorSizeStockSelectorModalComponent from './ColorSizeStockSelectorModalComponent';
import SelectedItem from './SelectedItem';

function SelectedItemsModalComponent({ selectedItems, setSelectedItems }: any) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  return (
    <TouchableWithoutFeedback>
      <ScrollView style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={{ marginHorizontal: 8 }}>
            <Text style={styles.header}>Izabrani artikli</Text>
            {/* LIST */}
            <Animated.FlatList
              style={[styles.listContainer, globalStyles.border]}
              data={selectedItems}
              renderItem={({ item, index }) => (
                <SelectedItem item={item} setSelectedItems={setSelectedItems} index={index} />
              )}
              keyExtractor={(item, index) => `${index}-${item._id}`}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
            <Text style={styles.header}>Boje | Veličine</Text>
            <Animated.FlatList
              style={styles.colorSizePickers}
              data={selectedItems}
              renderItem={({ item, index }) => (
                <ColorSizeStockSelectorModalComponent
                  product={item}
                  setSelectedItems={setSelectedItems}
                  index={index}
                />
              )}
              keyExtractor={(item, index) => `${index}-${item._id}`}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      padding: 8,
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primaryDark,
      marginBottom: 6,
      marginTop: 10,
    },
    listContainer: {
      padding: 10,
      marginBottom: 6,
      minHeight: 250,
    },
    colorSizePickers: {
      marginBottom: 6,
      minHeight: 250,
    },
  });
}

export default SelectedItemsModalComponent;
