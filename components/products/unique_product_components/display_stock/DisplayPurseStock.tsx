import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { useToggleFadeAnimation } from '../../../../hooks/useFadeAnimation';
import { PurseTypes } from '../../../../types/allTsTypes';

interface PropTypes {
  isExpanded: boolean;
  item: PurseTypes;
}

function DisplayPurseStock({ isExpanded, item }: PropTypes) {
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const styles = getStyles();

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
            <Text style={styles.header}>Boja</Text>
            <Text style={styles.header}>Količina</Text>
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
              <Text style={styles.colorLabel2}>{item.color}</Text>
              <Text key={`${item.color}${index}`} style={styles.sizeText}>
                {item.stock}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </>
  );
}

function getStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      padding: 4,
      borderRadius: 4,
      borderColor: Colors.secondaryLight,
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
      borderColor: '#ddd',
    },
    header: {
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
    rowColorOnStock: {
      backgroundColor: Colors.successSecondary,
    },
    rowColorOutOfStock: {
      backgroundColor: Colors.secondaryHighlight,
    },
    colorLabel2: {
      textAlign: 'center',
      flex: 1,
    },
    sizeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryDark,
      textAlign: 'center',
      padding: 8,
      flex: 1,
    },
  });
}

export default DisplayPurseStock;
