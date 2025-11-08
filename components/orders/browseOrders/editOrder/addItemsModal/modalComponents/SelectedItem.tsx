import { Pressable, StyleSheet, Text } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../../../../store/theme-context';

function SelectedItem({ item, setSelectedItems, index }: any) {
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
      backgroundColor: colors.background,
      elevation: 1,
      borderRadius: 4,
      marginBottom: 6,
      borderColor: colors.borderColor,
    },
    pressed: {
      opacity: 0.7,
      elevation: 1,
    },
    text: {
      color: colors.defaultText,
      fontSize: 16,
    },
  });
}

export default SelectedItem;
