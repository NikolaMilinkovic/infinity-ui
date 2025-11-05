import { useContext } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { AllProductsContext } from '../../../../../../store/all-products-context';
import { ThemeColors, useThemeColors } from '../../../../../../store/theme-context';

function SelectedItem({ item, setSelectedItems, index }: any) {
  const products = useContext(AllProductsContext);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  function onPressHandler() {
    setSelectedItems((prev: any) => prev.filter((_: any, i: number) => i !== index));
  }
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      key={`${index}-${item._id}`}
    >
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        {index + 1}. {item.name}
      </Text>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    pressable: {
      width: '100%',
      padding: 10,
      backgroundColor: colors.white,
      elevation: 1,
      borderRadius: 4,
      marginBottom: 6,
      borderColor: colors.secondaryLight,
    },
    pressed: {
      opacity: 0.7,
      elevation: 1,
    },
    text: {
      color: colors.primaryDark,
      fontSize: 16,
    },
  });
}

export default SelectedItem;
