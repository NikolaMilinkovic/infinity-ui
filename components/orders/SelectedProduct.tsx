import { Pressable, StyleSheet } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { NewOrderContextTypes, ProductTypes } from '../../types/allTsTypes';
import CustomText from '../../util-components/CustomText';

interface PropTypes {
  item: ProductTypes;
  orderCtx: NewOrderContextTypes;
  index: number;
}
function SelectedProduct({ item, orderCtx, index }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  function onPressHandler() {
    item.totalStock++;
    orderCtx.removeProductReference(index);
    orderCtx.removeProduct(index);
  }
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, globalStyles.elevation_1]}
      key={`${index}-${item._id}`}
    >
      <CustomText style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        {index + 1}. {item.name}
      </CustomText>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    pressable: {
      width: '100%',
      padding: 10,
      backgroundColor: colors.background,
      elevation: 1,
      borderRadius: 4,
      marginBottom: 6,
      borderColor: colors.borderColor,
      borderWidth: 0.5,
    },
    pressed: {
      opacity: 0.7,
      elevation: 1,
    },
    text: {
      color: colors.defaultText,
      fontSize: 14,
    },
  });
}

export default SelectedProduct;
