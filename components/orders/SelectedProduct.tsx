import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { NewOrderContextTypes, ProductTypes } from '../../types/allTsTypes';

interface PropTypes {
  item: ProductTypes;
  orderCtx: NewOrderContextTypes;
  index: number;
}
function SelectedProduct({ item, orderCtx, index }: PropTypes) {
  function onPressHandler() {
    // item.totalStock++;
    orderCtx.removeProductReference(index);
    orderCtx.removeProduct(index);
  }
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      key={`${index}-${item._id}`}
    >
      <Text style={styles.text}>
        [{index + 1}] {item.name}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    padding: 10,
    backgroundColor: Colors.secondaryLight,
    elevation: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  pressed: {
    opacity: 0.7,
    elevation: 1,
  },
  text: {
    color: Colors.primaryDark,
    fontSize: 16,
  },
});

export default SelectedProduct;
