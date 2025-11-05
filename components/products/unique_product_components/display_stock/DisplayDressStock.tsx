import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useToggleFadeAnimation } from '../../../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../../../store/theme-context';
import { DressTypes } from '../../../../types/allTsTypes';
import CustomText from '../../../../util-components/CustomText';

interface PropTypes {
  isExpanded: boolean;
  item: DressTypes;
}
function DisplayDressStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const colors = useThemeColors();
  const styles = getStyles(colors, availableColors.length === 0);

  // Extracts all the colors that have at least one size withing its stock
  useEffect(() => {
    if (!item) return;
    if (item.stockType === 'Boja-Veličina-Količina') {
      // Filter colors that have at least one size with stock
      const colorsWithStock = item.colors
        .filter((colorObj) => colorObj.sizes.some((sizeObj) => sizeObj.stock > 0))
        .map((colorObj) => colorObj.color);
      setAvailableColors(colorsWithStock);
    }
  }, [item]);

  if (!item) return;
  return (
    <>
      {isExpanded && item.stockType === 'Boja-Veličina-Količina' && (
        <Animated.View style={[styles.container, { overflow: 'hidden', opacity: toggleFade }]}>
          <View style={styles.sizesContainer}>
            <CustomText variant="bold" style={{ width: 100, textAlign: 'center' }}>
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
          {item.colors.map((colorItem, index) => {
            // Sort sizes so "UNI" comes first
            const sortedSizes = [...colorItem.sizes].sort((a, b) => {
              if (a.size === 'UNI') return -1;
              if (b.size === 'UNI') return 1;
              return 0;
            });

            return (
              <View
                style={[
                  styles.rowContainer,
                  index % 2 === 0
                    ? availableColors.length > 0
                      ? styles.rowColorOnStock
                      : styles.rowColorOutOfStock
                    : styles.rowColor2,
                ]}
                key={`${index}-${colorItem.color}`}
              >
                <Text style={styles.colorLabel2}>{colorItem.color}</Text>

                {sortedSizes.map((size, index) => (
                  <Text key={`${colorItem.color}${index}`} style={styles.sizeText}>
                    {size.stock}
                  </Text>
                ))}

                {/* {sortedSizes.map((size, index) => (
                    <Pressable
                      onPress={() => console.log(`> You selected ${size.size}`)}
                      key={`${colorItem.color}${index}`} 
                      style={styles.pressable} 
                    >
                      <Text style={styles.sizeText}>{size.stock}</Text>
                    </Pressable>
                  ))} */}
              </View>
            );
          })}
        </Animated.View>
      )}
    </>
  );
}

function getStyles(colors: ThemeColors, onStock: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: 4,
      borderRadius: 4,
      borderColor: colors.borderColor,
      borderWidth: 0.5,
      marginBottom: 10,
      marginTop: 10,
    },
    sizesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 2,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
    },
    header: {
      flex: 1,
      textAlign: 'center',
      color: colors.highlightText,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 2,
      backgroundColor: onStock ? colors.outOfStockButtonColor : 'transparent',
    },
    rowColorOnStock: {
      backgroundColor: colors.background1,
    },
    rowColor2: {},
    rowColorOutOfStock: {
      backgroundColor: colors.outOfStockSelectedProductBackground,
    },
    colorLabel2: {
      width: 100,
      textAlign: 'center',
      color: colors.defaultText,
    },
    sizeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.defaultText,
      textAlign: 'center',
      padding: 8,
      paddingHorizontal: 4,
      marginHorizontal: 4,
      flex: 1,
    },
    pressable: {
      padding: 6,
      borderWidth: 0.5,
      borderColor: colors.success,
    },
  });
}

export default DisplayDressStock;
