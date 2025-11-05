import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import { PurseColorTypes } from '../types/allTsTypes';
import CustomText from './CustomText';

interface PropTypes {
  colorsData: PurseColorTypes[];
  setColorsData: (data: PurseColorTypes[]) => void;
}

function ColorStockInputs({ colorsData, setColorsData }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Initialize stock to 0 if undefined
  const initializedColorsData = colorsData.map((item) => ({
    ...item,
    stock: item.stock ?? 0,
  }));

  // Method for handling input changes
  function handleInputChange(color: string, value: string) {
    const newStock = parseInt(value, 10) || 0;
    const updatedColorStock = initializedColorsData.map((item) => {
      if (item.color === color) {
        return { ...item, stock: newStock };
      }
      return item;
    });

    setColorsData(updatedColorStock);
  }

  // If no colors present
  if (initializedColorsData.length < 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizesContainer}>
        <CustomText variant="bold" style={{ width: 100, textAlign: 'center', color: colors.defaultText }}>
          Boja
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          Količina
        </CustomText>
      </View>
      {initializedColorsData.map((item, index) => (
        <KeyboardAvoidingView
          style={[styles.rowContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2]}
          key={`${index}-${item.color}`}
        >
          <Text style={styles.colorLabel}>{item.color}</Text>
          <TextInput
            key={`${item._id}-${item.color}`}
            placeholder="0"
            keyboardType="number-pad"
            style={styles.input}
            value={String(item.stock)}
            onChangeText={(value) => handleInputChange(item.color, value)}
            selectTextOnFocus
          />
        </KeyboardAvoidingView>
      ))}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 4,
      borderRadius: 4,
      borderColor: colors.borderColor,
      borderWidth: 0.5,
      marginTop: 10,
    },
    sizesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
    },
    header: {
      flex: 1,
      textAlign: 'center',
      color: colors.defaultText,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 2,
    },
    rowColor1: {
      backgroundColor: colors.background1,
    },
    rowColor2: {},
    input: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 4,
      padding: 8,
      paddingHorizontal: 4,
      marginHorizontal: 4,
      flex: 1,
      textAlign: 'center',
      backgroundColor: colors.background,
      color: colors.defaultText,
    },
    colorLabel: {
      width: 100,
      textAlign: 'center',
      color: colors.defaultText,
    },
  });
}

export default ColorStockInputs;
