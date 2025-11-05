import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import { DressColorTypes } from '../types/allTsTypes';
import CustomText from './CustomText';

interface PropTypes {
  colorsData: DressColorTypes[];
  setColorsData: (data: DressColorTypes[]) => void;
}

function ColorSizeInputs({ colorsData, setColorsData }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Ensure all sizes have a stock value initialized to 0 if undefined
  const initializedColorsData = colorsData.map((item) => ({
    ...item,
    sizes: item.sizes.map((sizeItem) => ({
      ...sizeItem,
      stock: sizeItem.stock ?? 0,
    })),
  }));

  // Method for handling input changes
  function handleInputChange(color: string, size: string, value: string) {
    const newStock = parseInt(value, 10) || 0;
    const updatedColors = initializedColorsData.map((item) => {
      if (item.color === color) {
        const updatedSizes = item.sizes.map((s) => (s.size === size ? { ...s, stock: newStock } : s));
        return { ...item, sizes: updatedSizes };
      }
      return item;
    });

    setColorsData(updatedColors);
  }

  // If no colors present
  if (colorsData.length < 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizesContainer}>
        <CustomText variant="bold" style={{ width: 100, textAlign: 'center', color: colors.defaultText }}>
          Boja
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          UNI
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          XS
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          S
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          M
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          L
        </CustomText>
        <CustomText variant="bold" style={styles.header}>
          XL
        </CustomText>
      </View>
      {initializedColorsData.map((item, index) => (
        <KeyboardAvoidingView
          style={[styles.rowContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2]}
          key={`${index}-${item.color}`}
        >
          <Text style={styles.colorLabel}>{item.color}</Text>

          {item.sizes.map((sizeObj) => (
            <TextInput
              key={`${item._id}-${sizeObj.size}`}
              placeholder="0"
              keyboardType="number-pad"
              style={styles.input}
              value={String(sizeObj.stock)}
              onChangeText={(value) => handleInputChange(item.color, sizeObj.size, value)}
              selectTextOnFocus
            />
          ))}
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
    },
    sizesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
    },
    header: {
      color: colors.defaultText,
      flex: 1,
      textAlign: 'center',
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

export default ColorSizeInputs;
