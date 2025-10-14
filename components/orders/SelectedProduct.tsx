import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { globalStyles } from '../../constants/globalStyles';
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
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, globalStyles.elevation_1]}
      key={`${index}-${item._id}`}
    >
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        {index + 1}. {item.name}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    padding: 10,
    backgroundColor: Colors.white,
    elevation: 1,
    borderRadius: 4,
    marginBottom: 6,
    borderColor: Colors.secondaryLight,
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
