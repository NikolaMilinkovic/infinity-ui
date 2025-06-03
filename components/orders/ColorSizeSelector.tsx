import React, { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import RadioButtonsGroup from 'react-native-radio-buttons-group';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { NewOrderContext } from '../../store/new-order-context';
import { DressColorTypes, DressTypes, OrderProductTypes, PurseColorTypes } from '../../types/allTsTypes';
interface ButtonTypes {
  id: string;
  value: string;
  label: string;
}
interface Product {
  itemReference: DressTypes;
  selectedColor: string;
  selectedSize: string;
}
interface PropTypes {
  product: Product;
  index: number;
}
function ColorSizeSelector({ product, index }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(true);
  const orderCtx = useContext(NewOrderContext);
  const [productColors, setProductColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [colorButtons, setColorButtons] = useState<ButtonTypes[]>([]);
  const [sizeButtons, setSizeButtons] = useState<ButtonTypes[]>([]);
  const styles = getStyles(product.selectedColor, product.selectedSize);

  useEffect(() => {
    if (!product) return;

    if (product.itemReference.stockType === 'Boja-Veličina-Količina') {
      const filteredColors = product.itemReference.colors.filter((color: DressColorTypes) =>
        color.sizes.some((size) => size.stock > 0)
      );
      setProductColors(filteredColors);
    }
    if (product.itemReference.stockType === 'Boja-Količina') {
      const filteredColors = product.itemReference.colors.filter((color: PurseColorTypes) => color.stock > 0);
      setProductColors(filteredColors);
    }
  }, [product]);

  // CREATE RADIO BUTTONS
  useEffect(() => {
    if (productColors) {
      const filteredColors = productColors.map((color: DressColorTypes, index) => ({
        id: `${color.color}`,
        label: color.color,
        value: color._id,
      }));

      setColorButtons(filteredColors);
    }
  }, [productColors]);

  // Filter sizes with stock > 0
  useEffect(() => {
    if (product.itemReference.stockType === 'Boja-Količina') return;
    if (product.selectedColor) {
      const selectedColorObj = product.itemReference.colors.find((color) => color.color === product.selectedColor);

      if (selectedColorObj) {
        const filteredSizes = selectedColorObj.sizes
          .filter((size) => size.stock > 0)
          .map((size) => ({
            id: size.size,
            label: size.size,
            value: size._id,
          }));

        setSizeButtons(filteredSizes);
      }
    }
  }, [product.selectedColor]);

  function handleColorSelect(index: number, color: string, product: OrderProductTypes) {
    // Filter all colors and find the selected color object
    const colorObj = product.itemReference.colors.find((obj) => obj.color === color);

    // Update the order object & cache selected color obj
    setSelectedColor(colorObj);
    orderCtx.updateProductColorByIndex(index, colorObj);
    if (product.hasOwnProperty('selectedSize')) {
      const sizeObj = { _id: '', size: '' };
      orderCtx.updateProductSizeByIndex(index, sizeObj);
    }
  }

  function handleSizeSelect(index: number, size: string, product: OrderProductTypes) {
    // Find the size object and update the order object with selected size & id
    if (product.hasOwnProperty('selectedSize')) {
      const sizeObj = selectedColor.sizes.find((obj) => obj.size === size);
      orderCtx.updateProductSizeByIndex(index, sizeObj);
    }
  }

  if (!product) return;
  return (
    <Animated.ScrollView style={styles.container}>
      {/* TOGGLE  BUTTON */}
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.headerContainer}>
        <Text style={styles.header}>{product?.itemReference?.name}</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={Colors.white}
        />
      </Pressable>
      {isExpanded && (
        <>
          <View style={styles.colorsContainer}>
            {/* COLOR PICKERS */}
            <Text style={styles.colorHeader}> Boja</Text>
            <RadioButtonsGroup
              radioButtons={colorButtons}
              // onPress={(value) => handleColorSelect(index, value, product)}
              onPress={(color) => handleColorSelect(index, color, product)}
              containerStyle={styles.radioButtonsContainer}
              selectedId={product.selectedColor}
              labelStyle={styles.label}
            />
          </View>

          {/* SIZE PICKER */}
          {product.selectedColor && product.itemReference.stockType !== 'Boja-Količina' && (
            <View style={styles.sizeContainer}>
              <Text style={styles.colorHeader}> Veličina</Text>
              <RadioButtonsGroup
                radioButtons={sizeButtons}
                onPress={(size) => handleSizeSelect(index, size, product)}
                containerStyle={styles.radioButtonsContainer}
                selectedId={product.selectedSize}
                labelStyle={styles.label}
              />
            </View>
          )}
        </>
      )}
    </Animated.ScrollView>
  );
}

function getStyles(selectedColor: string, selectedSize: string) {
  return StyleSheet.create({
    headerContainer: {
      padding: 10,
      flexDirection: 'row',
    },
    iconStyle: {
      marginLeft: 'auto',
      color: Colors.primaryDark,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.primaryDark,
    },
    container: {
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 4,
      marginBottom: 8,
    },
    colorsContainer: {
      backgroundColor: selectedColor ? 'transparent' : Colors.secondaryHighlight,
    },
    sizeContainer: {
      backgroundColor: selectedSize ? 'transparent' : Colors.secondaryHighlight,
    },
    radioButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 6,
      paddingHorizontal: 6,
    },
    label: {
      color: Colors.primaryDark,
    },
    colorHeader: {
      borderTopWidth: 0.5,
      borderTopColor: Colors.primaryDark,
      color: Colors.primaryDark,
      fontSize: 16,
      fontWeight: 'bold',
      padding: 6,
      marginBottom: 4,
    },
  });
}

export default ColorSizeSelector;
