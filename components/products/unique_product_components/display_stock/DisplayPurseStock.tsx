import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useToggleFadeAnimation } from '../../../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../../../store/theme-context';
import { PurseTypes } from '../../../../types/allTsTypes';
import CustomText from '../../../../util-components/CustomText';

interface PropTypes {
  isExpanded: boolean;
  item: PurseTypes;
}

function DisplayPurseStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const colors = useThemeColors();
  const styles = getStyles(colors, availableColors.length === 0);

  useEffect(() => {
    if (!item) return;
    if (item.stockType === 'Boja-Količina') {
      // Filter colors with stock greater than 0
      const colorsWithStock = item.colors.filter((colorObj) => colorObj.stock > 0).map((colorObj) => colorObj.color);
      setAvailableColors(colorsWithStock);
    }
  }, [item]);

  if (!item) return;
  return (
    <>
      {isExpanded && item.stockType === 'Boja-Količina' && (
        <Animated.View style={[styles.container, { overflow: 'hidden', opacity: toggleFade }]}>
          <View style={styles.sizesContainer}>
            <CustomText variant="bold" style={styles.header}>
              Boja
            </CustomText>
            <CustomText variant="bold" style={styles.header}>
              Količina
            </CustomText>
          </View>

          {item.colors.map((item, index) => (
            <View
              style={[
                styles.rowContainer,
                index % 2 === 0
                  ? availableColors.length > 0
                    ? styles.rowColorOnStock
                    : styles.rowColorOutOfStock
                  : null,
              ]}
              key={`${index}-${item.color}`}
            >
              <CustomText style={styles.colorLabel2}>{item.color}</CustomText>
              <CustomText key={`${item.color}${index}`} style={styles.sizeText}>
                {item.stock}
              </CustomText>
            </View>
          ))}
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
    rowColorOutOfStock: {
      backgroundColor: colors.outOfStockSelectedProductBackground,
    },
    colorLabel2: {
      textAlign: 'center',
      flex: 1,
      color: colors.defaultText,
    },
    sizeText: {
      fontSize: 14,
      color: colors.defaultText,
      textAlign: 'center',
      padding: 8,
      flex: 1,
    },
  });
}

export default DisplayPurseStock;
